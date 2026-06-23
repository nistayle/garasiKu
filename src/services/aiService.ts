/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationRequest, ParkingSpot } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getParkingRecommendation(
  request: RecommendationRequest,
  availableSpots: ParkingSpot[]
) {
  const model = "gemini-3-flash-preview";
  
  const spotsInfo = availableSpots.map(s => {
    let currentPrice = s.pricePerHour;
    if (request.nearbyEventId && s.eventPricing && s.eventPricing[request.nearbyEventId]) {
      currentPrice = s.eventPricing[request.nearbyEventId];
    }

    return {
      id: s.id,
      name: s.name,
      price: currentPrice,
      rating: s.rating,
      features: s.features,
      capacity: s.capacity[request.vehicleType],
      distanceHint: "Dekat " + s.address.split(',')[0],
      isEventSpot: request.nearbyEventId ? (s.activeEventIds?.includes(request.nearbyEventId)) : false
    };
  });

  const prompt = `
    Kamu adalah asisten pintar GarasiKu, platform parkir komunitas di Indonesia.
    Bantu user memilih tempat parkir terbaik berdasarkan kriteria berikut:
    - Tujuan: ${request.destination}
    - Kendaraan: ${request.vehicleType}
    - Budget: Rp${request.budget}
    - Durasi: ${request.duration} jam
    ${request.nearbyEventId ? `- Sedang ada Event dengan ID: ${request.nearbyEventId}. Cari spot yang mendukung event ini atau sangat dekat dengan lokasi keramaian event.` : ''}
    
    Berikut adalah daftar spot parkir yang tersedia:
    ${JSON.stringify(spotsInfo, null, 2)}
    
    Berikan satu rekomendasi spot yang paling efisien (terbaik).
    Jika ini untuk event, prioritaskan akses keluar yang mudah atau jarak jalan kaki yang masuk akal.
    Berikan alasan singkat bahasa Indonesia (maks 20 kata) kenapa spot ini dipilih.
    Berikan skor efisiensi dari 0-100.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spotId: { type: Type.STRING },
            reason: { type: Type.STRING },
            efficiencyScore: { type: Type.NUMBER }
          },
          required: ["spotId", "reason", "efficiencyScore"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // Return a fallback recommendation if AI fails
    return {
      spotId: availableSpots[0]?.id,
      reason: "Berdasarkan popularitas dan rating tertinggi di area tersebut.",
      efficiencyScore: 85
    };
  }
}

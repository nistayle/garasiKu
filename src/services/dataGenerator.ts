/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CityEvent, ParkingSpot, VehicleType, ParkingStatus, AvailabilityType, ParkingSource, LiveActivity } from '../types';

const CITIES = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 
  'Solo', 'Bali', 'Malang', 'Makassar', 'Medan', 'Palembang'
];

const EVENT_NAMES = [
  'Festival Kuliner Nusantara', 'Konser Harmoni Alam', 'Tech Startup Summit', 
  'Pameran Seni Kontemporer', 'Maraton Kota Sehat', 'Car Free Night Night Market',
  'National E-sports Championship', 'Indonesian Fashion Week', 'K-Pop World Tour',
  'International Book Fair', 'Creative Economy Expo'
];

const VENUES: { [city: string]: string[] } = {
  'Jakarta': ['Gelora Bung Karno', 'Jakarta International Stadium', 'JIExpo Kemayoran', 'Ancol'],
  'Bandung': ['Stadion Gelora Bandung Lautan Api', 'Gedung Sate', 'Saung Angklung Udjo'],
  'Surabaya': ['Stadion Gelora Bung Tomo', 'Jatim International Expo', 'Grand City Mall'],
  'Yogyakarta': ['Stadion Mandala Krida', 'Jogja Expo Center', 'Alun-Alun Utara', 'KM 0 Jogja'],
  'Bali': ['GWK Cultural Park', 'Nusa Dua Convention Center', 'Stadion Dipta'],
  'Malang': ['Stadion Kanjuruhan', 'Dome UMM', 'Ijen Boulevard'],
};

export const generateEvents = (): CityEvent[] => {
  const events: CityEvent[] = [];
  
  CITIES.forEach((city, index) => {
    const venueList = VENUES[city] || [`Pusat Kota ${city}`];
    const venue = venueList[Math.floor(Math.random() * venueList.length)];
    const eventName = EVENT_NAMES[Math.floor(Math.random() * EVENT_NAMES.length)];
    
    events.push({
      id: `dynamic-e-${index}`,
      name: `${eventName} @ ${city}`,
      city: city,
      description: `Event internasional terkemuka yang menyatukan ribuan orang di ${venue}, ${city}. Bergabunglah untuk pengalaman tak terlupakan.`,
      location: venue,
      coordinates: {
        lat: -6.2088 + (Math.random() - 0.5) * 5, // Approximate ID range
        lng: 106.8456 + (Math.random() - 0.5) * 10
      },
      category: ['Festival', 'Concert', 'Exhibition', 'Cultural', 'Sports'][Math.floor(Math.random() * 5)] as any,
      date: `${Math.floor(Math.random() * 28) + 1} Juni 2026`,
      time: '14:00 - 22:00',
      image: `https://images.unsplash.com/photo-${1500000000000 + index}?q=80&w=800&auto=format&fit=crop`,
      expectedCrowd: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as any
    });
  });
  
  return events;
};

export const enrichSpotWithDynamicData = (spot: ParkingSpot): ParkingSpot => {
  const occupancyRate = Math.floor(Math.random() * 100);
  let crowdLevel: 'Low' | 'Medium' | 'High' = 'Low';
  
  if (occupancyRate > 80) crowdLevel = 'High';
  else if (occupancyRate > 40) crowdLevel = 'Medium';
  
  return {
    ...spot,
    occupancyRate,
    crowdLevel,
    exitEfficiency: 40 + Math.floor(Math.random() * 60)
  };
};

export const generateLiveActivities = (): LiveActivity[] => {
  const messages = [
    '12 kendaraan baru masuk area Malioboro',
    'Area konser mulai padat, parkir alternatif dibuka',
    '3 lahan baru dibuka warga sekitar di zona Utara',
    'AI merekomendasikan area timur untuk akses keluar lebih cepat',
    'Parkiran Garasi Pak Budi baru saja terisi penuh',
    'Kemacetan terdeteksi di jalan utama dekat venue',
    'Sistem mendeteksi 5 slot kosong di area selatan',
    'Update cuaca: Cerah, area parkir luar ruangan sangat ideal'
  ];
  
  return messages.map((msg, i) => ({
    id: `act-${i}`,
    message: msg,
    timestamp: 'Baru saja',
    type: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)] as any
  }));
};

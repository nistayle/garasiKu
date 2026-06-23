/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ParkingSpot, ParkingStatus, VehicleType, ParkingSource, AvailabilityType } from '../types';
import { DUMMY_SPOTS } from '../constants';
import { enrichSpotWithDynamicData } from './dataGenerator';

const STORAGE_KEY = 'garasiku_parking_spots';

const calculateStatus = (spot: ParkingSpot): ParkingStatus => {
  // Respect manual status override if set to CLOSED
  if (spot.status === ParkingStatus.CLOSED) {
    return ParkingStatus.CLOSED;
  }

  const carSlots = spot.capacity[VehicleType.MOBIL] || 0;
  const motorSlots = spot.capacity[VehicleType.MOTOR] || 0;
  const totalSlots = carSlots + motorSlots;

  if (totalSlots === 0) {
    return ParkingStatus.FULL;
  }

  // Threshold for almost full (e.g., total slots < 2)
  if (totalSlots < 3) {
    return ParkingStatus.ALMOST_FULL;
  }

  if (spot.availabilityType === AvailabilityType.PERMANENT) {
    return ParkingStatus.AVAILABLE;
  }

  if (!spot.startDate || !spot.endDate) return ParkingStatus.AVAILABLE;

  const now = new Date();
  const start = new Date(spot.startDate);
  const end = new Date(spot.endDate);

  // Set time to end of day for end date
  end.setHours(23, 59, 59, 999);

  if (now < start) return ParkingStatus.COMING_SOON;
  if (now > end) return ParkingStatus.ENDED;
  return ParkingStatus.AVAILABLE;
};

// Add ownerId, source and availability to dummy spots for consistency
const SEED_SPOTS: ParkingSpot[] = DUMMY_SPOTS.map(spot => ({
  ...spot,
  source: ParkingSource.COMMUNITY,
  availabilityType: spot.availabilityType || AvailabilityType.PERMANENT
}));

export const parkingService = {
  getSpots: (): ParkingSpot[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const currentSpots: ParkingSpot[] = stored ? JSON.parse(stored) : [];
    const deletedIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY + '_deleted') || '[]');
    
    // Ensure uniqueness by ID
    const spotMap = new Map<string, ParkingSpot>();
    
    // 1. Add SEED_SPOTS first (if not deleted)
    SEED_SPOTS.forEach(seed => {
      if (!deletedIds.includes(seed.id)) {
        spotMap.set(seed.id, seed);
      }
    });

    // 2. Add current stored spots (they overwrite seeds if same ID, or add new ones)
    currentSpots.forEach(s => {
      if (!deletedIds.includes(s.id)) {
        spotMap.set(s.id, s);
      }
    });

    const mergedSpots = Array.from(spotMap.values());

    return mergedSpots.map(s => {
      const baseSpot = { 
        ...s, 
        source: s.source || ParkingSource.COMMUNITY,
        availabilityType: s.availabilityType || AvailabilityType.PERMANENT
      };
      const enrichedSpot = enrichSpotWithDynamicData(baseSpot);
      return { ...enrichedSpot, status: calculateStatus(enrichedSpot) };
    });
  },

  saveSpot: (spot: Partial<ParkingSpot> & { name: string; address: string }): ParkingSpot => {
    const spots = parkingService.getSpots();
    const newSpot: ParkingSpot = {
      id: spot.id || crypto.randomUUID(),
      name: spot.name,
      ownerName: spot.ownerName || 'User Mitra',
      ownerId: spot.ownerId || 'current-user-123',
      address: spot.address,
      pricePerHour: spot.pricePerHour || 5000,
      capacity: spot.capacity || { [VehicleType.MOTOR]: 5, [VehicleType.MOBIL]: 2 },
      rating: spot.rating || 0,
      reviewsCount: spot.reviewsCount || 0,
      coordinates: spot.coordinates || { lat: -7.7956, lng: 110.3695 },
      images: spot.images || ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=600&auto=format&fit=crop'],
      features: spot.features || [],
      isVerified: spot.isVerified || false,
      safetyScore: spot.safetyScore || 80,
      status: spot.status || ParkingStatus.AVAILABLE,
      description: spot.description || '',
      availabilityType: spot.availabilityType || AvailabilityType.PERMANENT,
      startDate: spot.startDate,
      endDate: spot.endDate,
      operatingHours: spot.operatingHours,
      relatedEventName: spot.relatedEventName,
      isEventOnly: spot.isEventOnly || false,
      activeEventIds: spot.activeEventIds || [],
      eventPricing: spot.eventPricing || {},
      source: ParkingSource.COMMUNITY,
      updatedAt: new Date().toISOString()
    };

    // Filter out seed spots before saving to localStorage to prevent pollution
    const stored = localStorage.getItem(STORAGE_KEY);
    const userSpots: ParkingSpot[] = stored ? JSON.parse(stored) : [];
    
    const existingIndex = userSpots.findIndex(s => s.id === newSpot.id);
    if (existingIndex > -1) {
      userSpots[existingIndex] = newSpot;
    } else {
      userSpots.push(newSpot);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userSpots));
    return newSpot;
  },

  deleteSpot: (id: string) => {
    const spots = parkingService.getSpots().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
    
    // Track deleted IDs to prevent seed spots from reappearing
    const deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY + '_deleted') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(STORAGE_KEY + '_deleted', JSON.stringify(deletedIds));
    }
  },

  getSpotsByOwner: (ownerId: string): ParkingSpot[] => {
    return parkingService.getSpots().filter(s => s.ownerId === ownerId);
  },

  searchSpots: (query: string): ParkingSpot[] => {
    const spots = parkingService.getSpots().filter(spot => {
      // Hide ended temporary spots from general search
      if (spot.availabilityType === AvailabilityType.TEMPORARY && spot.status === ParkingStatus.ENDED) {
        return false;
      }
      return true;
    });
    if (!query) return spots;
    
    const lowerQuery = query.toLowerCase();
    return spots.filter(spot => 
      spot.name.toLowerCase().includes(lowerQuery) ||
      spot.address.toLowerCase().includes(lowerQuery) ||
      spot.description.toLowerCase().includes(lowerQuery) ||
      (spot.activeEventIds && spot.activeEventIds.some(id => id.toLowerCase().includes(lowerQuery)))
    );
  }
};

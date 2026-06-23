/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum VehicleType {
  MOTOR = 'Motor',
  MOBIL = 'Mobil',
}

export enum ParkingStatus {
  AVAILABLE = 'Tersedia',
  FULL = 'Penuh',
  ALMOST_FULL = 'Hampir Penuh',
  CLOSED = 'Tutup',
  COMING_SOON = 'Segera Dibuka',
  ENDED = 'Berakhir',
}

export enum AvailabilityType {
  PERMANENT = 'PERMANENT',
  TEMPORARY = 'TEMPORARY',
}

export enum ParkingSource {
  COMMUNITY = 'COMMUNITY',
  PUBLIC = 'PUBLIC',
}

export interface ParkingSpot {
  id: string;
  name: string;
  ownerName: string;
  ownerId: string;
  address: string;
  pricePerHour: number;
  capacity: {
    [key in VehicleType]: number;
  };
  rating: number;
  reviewsCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  features: string[];
  isVerified: boolean;
  safetyScore: number;
  status: ParkingStatus;
  description: string;
  availabilityType: AvailabilityType;
  startDate?: string;
  endDate?: string;
  operatingHours?: string;
  relatedEventName?: string;
  isEventOnly?: boolean;
  activeEventIds?: string[];
  eventPricing?: {
    [eventId: string]: number;
  };
  source?: ParkingSource;
  walkingDistance?: string;
  walkingTime?: string;
  // Dynamic fields
  exitEfficiency?: number; // 0-100
  crowdLevel?: 'Low' | 'Medium' | 'High';
  occupancyRate?: number; // 0-100
  updatedAt?: string;
}

export interface Booking {
  id: string;
  spotId: string;
  userId: string;
  vehicleType: VehicleType;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface CityEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: 'Festival' | 'Concert' | 'Exhibition' | 'Cultural' | 'Sports';
  date: string;
  time: string;
  image: string;
  expectedCrowd: 'Low' | 'Medium' | 'High';
}

export interface LiveActivity {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success';
}

export interface RecommendationRequest {
  destination: string;
  vehicleType: VehicleType;
  budget: number;
  duration: number; // in hours
  nearbyEventId?: string;
}

export interface AIRecommendation {
  spotId: string;
  reason: string;
  efficiencyScore: number;
}

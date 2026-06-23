/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CityEvent, ParkingSpot, LiveActivity } from '../types';
import { generateEvents, generateLiveActivities } from './dataGenerator';

const STORAGE_KEY_EVENTS = 'garasiku_dynamic_events';

export const eventService = {
  getEvents: (): CityEvent[] => {
    const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!stored) {
      const initialEvents = generateEvents();
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(initialEvents));
      return initialEvents;
    }
    return JSON.parse(stored);
  },

  searchEvents: (query: string): CityEvent[] => {
    const events = eventService.getEvents();
    if (!query) return events;
    
    const lowerQuery = query.toLowerCase();
    return events.filter(e => 
      e.name.toLowerCase().includes(lowerQuery) ||
      e.city.toLowerCase().includes(lowerQuery) ||
      e.location.toLowerCase().includes(lowerQuery) ||
      e.category.toLowerCase().includes(lowerQuery)
    );
  },

  getEventById: (id: string): CityEvent | undefined => {
    return eventService.getEvents().find(e => e.id === id);
  },

  getLiveActivity: (): LiveActivity[] => {
    // Generate fresh activities for live feel
    return generateLiveActivities();
  }
};

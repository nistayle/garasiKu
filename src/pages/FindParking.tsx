/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  List, 
  Star, 
  Navigation, 
  Compass,
  Info,
  Car,
  Bike,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowLeft,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Ticket,
  Calendar,
  History,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { DUMMY_SPOTS } from '../constants';
import { ParkingSpot, VehicleType, RecommendationRequest, CityEvent, ParkingStatus, ParkingSource, AvailabilityType, LiveActivity } from '../types';
import { Button, Card, ImageWithFallback } from '../components/UI';
import { getParkingRecommendation } from '../services/aiService';
import { parkingService } from '../services/parkingService';
import { eventService } from '../services/eventService';
import { AIRecommendationCard, CrowdStatus, LiveActivityFeed, EventDiscoverCard } from '../components/SmartFeatures';
import { toast } from 'sonner';
import { AuthenticatedNavbar } from '../components/AuthenticatedNavbar';
import { MobileBottomNav } from '../components/MobileBottomNav';

const AISuggestionOverlay = ({ 
  recommendation, 
  onClose, 
  spot 
}: { 
  recommendation: { spotId: string, reason: string, efficiencyScore: number }, 
  onClose: () => void,
  spot: ParkingSpot
}) => {
  const savings = (100 - (recommendation.efficiencyScore || 92)) * 2 + 10;
  
  return (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="fixed top-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-[130] px-2"
  >
    <div className="bg-slate-900/90 backdrop-blur-3xl p-1 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden">
      <div className="bg-white rounded-[2.8rem] p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
               <span className="font-black text-[10px] uppercase tracking-[0.2em] block">Gemini AI Selection</span>
               <span className="text-slate-900 font-black text-sm">Best Exit Route Found</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-lg">
            {recommendation.efficiencyScore}% Match
          </div>
        </div>
        <div className="flex gap-6 mb-8 p-4 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg relative">
            <ImageWithFallback src={spot.images[0]} alt={spot.name} />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-black text-slate-900 text-xl leading-none mb-2">{spot.name}</h4>
            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3" /> {spot.address.split(',')[0]}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-emerald-600 font-black text-sm">Rp{spot.pricePerHour.toLocaleString()}/jam</span>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100">
                 <Clock className="w-3 h-3 text-blue-500" />
                 <span className="text-[10px] font-black text-slate-700">~{savings}m Save</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50/50 rounded-2xl p-6 mb-8 relative border border-emerald-100/50">
          <div className="flex gap-4">
             <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-emerald-600" />
             </div>
             <p className="text-sm text-slate-700 font-medium italic leading-relaxed">
               "{recommendation.reason}"
             </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button className="flex-1 h-16 rounded-2xl text-lg font-black uppercase tracking-tight" onClick={onClose}>Lock Rekomendasi</Button>
          <button 
            onClick={onClose}
            className="px-6 h-16 text-slate-400 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-widest bg-slate-100 rounded-2xl"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const SpotCard: React.FC<{ spot: ParkingSpot, onClick: () => void }> = ({ spot, onClick }) => {
  const isCommunity = spot.source === ParkingSource.COMMUNITY;
  const isPublic = spot.source === ParkingSource.PUBLIC;
  const isEvent = spot.isEventOnly || (spot.activeEventIds && spot.activeEventIds.length > 0);
  const isTemporary = spot.availabilityType === AvailabilityType.TEMPORARY;
  const isRecommended = spot.safetyScore > 90 || (spot.rating >= 4.5 && spot.reviewsCount > 10);

  const walkingTime = spot.walkingTime || (Math.floor(Math.random() * 8) + 2).toString();
  const walkingDistance = spot.walkingDistance || "350m dari venue";

  const openInMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { lat, lng } = spot.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  // AI-Style recommendation logic
  const getAiBadge = () => {
    if (spot.safetyScore > 95) return "Paling Aman";
    if (isCommunity && spot.pricePerHour < 5000) return "Hidden Gem";
    if (isEvent) return "Akses Exit Cepat";
    return "AI Recommended";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="cursor-pointer group h-full"
    >
      <Card className="p-0 border-transparent hover:border-emerald-100 hover:shadow-2xl transition-all h-full flex flex-col overflow-hidden bg-white/70 backdrop-blur-md">
        <div className="relative h-44 overflow-hidden shrink-0">
          <ImageWithFallback 
            src={spot.images[0]} 
            alt={spot.name} 
            className="transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
            fallbackSrc="https://via.placeholder.com/600x400/059669/FFFFFF?text=GarasiKu+Spot"
          />
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur rounded-xl text-xs font-black text-emerald-800 shadow-xl border border-white/50">
            {spot.pricePerHour > 0 ? `Rp${(spot.pricePerHour / 1000).toFixed(0)}K` : 'Tarif Google'}<span className="text-[10px] font-medium text-slate-400 ml-1">/jam</span>
          </div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {isCommunity && (
              <div className="bg-emerald-500/90 text-white px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-lg backdrop-blur-md border border-white/20">
                <ShieldCheck className="w-3 h-3" /> WARGA LOKAL
              </div>
            )}
            {isPublic && (
              <div className="bg-blue-500/90 text-white px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-lg backdrop-blur-md border border-white/20">
                <MapPin className="w-3 h-3" /> PUBLIC PARKING
              </div>
            )}
            {isEvent && (
              <div className="bg-orange-500/90 text-white px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-lg backdrop-blur-md border border-white/20">
                <Ticket className="w-3 h-3" /> EVENT PARKING
              </div>
            )}
            {isTemporary && (
              <div className="bg-blue-500/90 text-white px-2 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-lg backdrop-blur-md border border-white/20">
                <Calendar className="w-3 h-3" /> TEMPORARY
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {walkingTime} min jalan
            </div>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-black text-slate-900 line-clamp-1 text-lg leading-none mb-1.5 group-hover:text-emerald-600 transition-colors">{spot.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-300" /> {walkingDistance}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 shrink-0">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-black text-yellow-700">{spot.rating || 'N/A'}</span>
            </div>
          </div>
          
          <div className="mb-4">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full ${
                      spot.status === ParkingStatus.AVAILABLE ? 'bg-emerald-500 animate-pulse' : 
                      spot.status === ParkingStatus.ALMOST_FULL ? 'bg-orange-500 animate-pulse' : 
                      spot.status === ParkingStatus.FULL ? 'bg-red-500' :
                      spot.status === ParkingStatus.COMING_SOON ? 'bg-blue-500' : 'bg-slate-400'
                   }`}></span>
                   <span className={`font-black text-[9px] uppercase tracking-widest ${
                      spot.status === ParkingStatus.AVAILABLE ? 'text-emerald-700' : 
                      spot.status === ParkingStatus.ALMOST_FULL ? 'text-orange-700' : 
                      spot.status === ParkingStatus.FULL ? 'text-red-700' : 
                      spot.status === ParkingStatus.COMING_SOON ? 'text-blue-700' : 'text-slate-700'
                   }`}>
                     {spot.status}
                   </span>
                </div>
                <div className="flex gap-2 text-[9px] font-black text-slate-400 uppercase">
                   <span className="flex items-center gap-1"><Car className="w-3 h-3" /> {spot.capacity[VehicleType.MOBIL]}</span>
                   <span className="flex items-center gap-1"><Bike className="w-3 h-3" /> {spot.capacity[VehicleType.MOTOR]}</span>
                </div>
             </div>
             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${spot.status === ParkingStatus.FULL ? 'bg-red-500' : spot.status === ParkingStatus.ALMOST_FULL ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, ((spot.capacity[VehicleType.MOBIL] + spot.capacity[VehicleType.MOTOR]) / 15) * 100)}%` }}
                />
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100/80 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Exit Efficiency</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${spot.exitEfficiency && spot.exitEfficiency > 80 ? 'bg-emerald-500' : spot.exitEfficiency && spot.exitEfficiency > 50 ? 'bg-orange-500' : 'bg-blue-500'}`} 
                        style={{ width: `${spot.exitEfficiency || 50}%` }} 
                      />
                   </div>
                   <span className="text-[10px] font-bold text-slate-700">{spot.exitEfficiency || 50}%</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={openInMaps}
              className="p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl transition-all transform group-hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
              title="Navigasi ke Lokasi"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function FindParking() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CityEvent | null>(null);
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | VehicleType>('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | AvailabilityType>('all');
  const [filterPrice, setFilterPrice] = useState<'all' | 'low' | 'high'>('all');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyFilter, setNearbyFilter] = useState(false);

  const TRENDING_SEARCHES = ['GBK Konser', 'JIEXPO Hall D', 'Stasiun Gambir', 'Malioboro', 'Pakuwon Mall'];


  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    // Initial fetch
    setSpots(parkingService.getSpots());
    setEvents(eventService.getEvents());
    setLiveActivities(eventService.getLiveActivity());
    
    // Interval for live activities
    const interval = setInterval(() => {
      setLiveActivities(eventService.getLiveActivity());
    }, 15000);

    // Ask for geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          if (map) map.setCenter(loc);
          toast.success('Lokasi berhasil dideteksi!');
        },
        () => {
          toast.info('Gunakan pencarian manual jika lokasi tidak terdeteksi.');
        },
        { enableHighAccuracy: true }
      );
    }

    return () => clearInterval(interval);
  }, [map]);

  const fetchHybridSpots = async (query: string = searchQuery, event: CityEvent | null = selectedEvent) => {
    setIsLoading(true);
    try {
      const communitySpots = parkingService.searchSpots(query);
      
      let publicSpots: ParkingSpot[] = [];
      
      if (placesLib && map && (query || userLocation || event)) {
        const service = new (placesLib as any).PlacesService(map);
        const textQuery = event ? `parking near ${event.name} ${event.location}` : (query ? `parking near ${query}` : 'parking lot');
        
        const results = await new Promise<any[]>((resolve, reject) => {
          service.textSearch({
            query: textQuery,
            location: userLocation || new google.maps.LatLng(-7.7956, 110.3695),
            radius: 5000,
            type: 'parking'
          }, (results: any, status: any) => {
            if (status === (placesLib as any).PlacesServiceStatus.OK || status === (placesLib as any).PlacesServiceStatus.ZERO_RESULTS) {
              resolve(results || []);
            } else {
              reject(new Error(`Places search failed: ${status}`));
            }
          });
        });

        publicSpots = results.map(p => ({
          id: p.place_id || Math.random().toString(),
          name: p.name || 'Public Parking',
          ownerName: 'Google Maps Public',
          ownerId: 'google-places',
          address: p.formatted_address || '',
          pricePerHour: 0,
          capacity: { [VehicleType.MOTOR]: 10, [VehicleType.MOBIL]: 10 },
          rating: p.rating || 0,
          reviewsCount: p.user_ratings_total || 0,
          coordinates: { 
            lat: p.geometry?.location?.lat() || 0, 
            lng: p.geometry?.location?.lng() || 0 
          },
          images: p.photos && p.photos.length > 0 
            ? [p.photos[0].getUrl({ maxWidth: 800 })] 
            : ["https://images.unsplash.com/photo-1590674852885-8c6424b33343?auto=format&fit=crop&q=80&w=800"],
          features: ['Public', 'Paid'],
          isVerified: true,
          safetyScore: 70,
          status: ParkingStatus.AVAILABLE,
          description: 'Parkir umum resmi terdaftar di Google Maps.',
          source: ParkingSource.PUBLIC,
          availabilityType: AvailabilityType.PERMANENT,
          walkingDistance: "Jarak bervariasi",
          walkingTime: "Estimasi di Maps"
        }));
      }

      // Merge and deduplicate by ID, prioritizing Community
      const spotMap = new Map<string, ParkingSpot>();
      
      // Community spots first
      communitySpots.forEach(s => spotMap.set(s.id, s));
      
      // Public spots next (if ID exists, community version stays)
      publicSpots.forEach(s => {
        if (!spotMap.has(s.id)) {
          spotMap.set(s.id, s);
        }
      });
      
      const sorted = Array.from(spotMap.values()).sort((a, b) => {
        if (a.source === ParkingSource.COMMUNITY && b.source !== ParkingSource.COMMUNITY) return -1;
        if (a.source !== ParkingSource.COMMUNITY && b.source === ParkingSource.COMMUNITY) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });

      setSpots(sorted);
    } catch (error) {
      console.error("Error fetching spots:", error);
      toast.error("Gagal memuat data parkir publik.");
      setSpots(parkingService.searchSpots(query));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHybridSpots();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedEvent, placesLib]);

  const handleAiRecommendation = async () => {
    setIsAiLoading(true);
    const request: RecommendationRequest = {
      destination: selectedEvent?.name || searchQuery || "Lokasi Anda",
      vehicleType: VehicleType.MOTOR,
      budget: 15000,
      duration: 3,
      nearbyEventId: selectedEvent?.id
    };

    setTimeout(async () => {
      const result = await getParkingRecommendation(request, spots);
      setAiRecommendation(result);
      setIsAiLoading(false);
      toast.success('Rekomendasi AI ditemukan!');
    }, 1500);
  };

  const filteredSpots = spots.filter(spot => {
    let matchesType = true;
    if (filterType !== 'all') {
      matchesType = spot.capacity[filterType] > 0;
    }

    let matchesPrice = true;
    if (filterPrice === 'low') matchesPrice = spot.pricePerHour <= 4000;
    if (filterPrice === 'high') matchesPrice = spot.pricePerHour > 4000;

    let matchesAvailability = true;
    if (filterAvailability !== 'all') {
      matchesAvailability = spot.availabilityType === filterAvailability;
    }

    return matchesType && matchesPrice && matchesAvailability;
  });

  const topSpot = filteredSpots.find(s => s.exitEfficiency && s.exitEfficiency > 85) || filteredSpots[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] pb-40 lg:pb-0">
      {/* AI Recommendation Overlay */}
      <AnimatePresence>
        {aiRecommendation && (
          <AISuggestionOverlay 
            recommendation={aiRecommendation} 
            spot={spots.find(s => s.id === aiRecommendation.spotId) || spots[0]}
            onClose={() => setAiRecommendation(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <AuthenticatedNavbar />

      {/* Sub-header for Search & Recommendations */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-4 md:py-5 sticky top-[65px] md:top-[73px] z-30 shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
            <div className="flex-1 relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text"
                placeholder="Cari kota, event, atau venue (e.g. GBK, JIEXPO)..."
                className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl md:rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 border border-slate-100 focus:border-emerald-500/20 transition-all font-black text-slate-800 placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={handleAiRecommendation}
              disabled={isAiLoading || spots.length === 0}
              className={`flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-[12px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-200/50 w-full lg:w-auto justify-center ${
                isAiLoading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 border-2 border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 text-white hover:-translate-y-1'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${isAiLoading ? 'animate-pulse' : 'text-emerald-400'}`} />
              {isAiLoading ? 'Analyzing...' : 'AI Recommendation'}
            </button>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap mr-2">Trending:</span>
            {TRENDING_SEARCHES.map(term => (
              <button 
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:text-emerald-700 whitespace-nowrap transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full">
        {/* Main Feed */}
        <main className="flex-1 px-4 md:px-6 py-6 md:py-8 overflow-y-auto">
          {/* AI Recommendation Highlight */}
          {selectedEvent && topSpot && (
            <div className="mb-10">
              <AIRecommendationCard spot={topSpot} />
            </div>
          )}

          {/* Discover Events */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Ticket className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Jelajah Event</h2>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">Semua Kota</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(events || []).slice(0, 4).map(event => (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                  className="cursor-pointer"
                >
                  <EventDiscoverCard event={event} />
                </div>
              ))}
            </div>
          </section>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8 border-t border-slate-100 pt-6 md:pt-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 capitalize">
                {selectedEvent ? `Garasi di ${selectedEvent.location}` : (searchQuery ? `Hasil: ${searchQuery}` : 'Lahan Parkir Pilihan')}
              </h2>
              <div className="flex items-center gap-2 text-[13px] md:text-sm text-slate-500 font-medium">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-slate-900 font-bold">{filteredSpots.length} Lahan</span> Aktif Saat Ini
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
               {[
                 { id: 'all', label: 'Semua', icon: List },
                 { id: 'cheap', label: 'Termurah', icon: TrendingUp },
                 { id: 'near', label: 'Terdekat', icon: Navigation },
                 { id: 'verified', label: 'Verified', icon: ShieldCheck },
                 { id: 'event', label: 'Event Parking', icon: Ticket },
                 { id: 'motor', label: 'Motor', icon: Bike },
                 { id: 'mobil', label: 'Mobil', icon: Car },
                 { id: 'low-traffic', label: 'Low Traffic', icon: Zap },
               ].map((chip) => (
                 <button
                   key={chip.id}
                   onClick={() => {
                     if (chip.id === 'all') {
                       setFilterType('all');
                       setFilterPrice('all');
                       setFilterAvailability('all');
                       setNearbyFilter(false);
                     } else if (chip.id === 'cheap') {
                       setFilterPrice(filterPrice === 'low' ? 'all' : 'low');
                     } else if (chip.id === 'motor') {
                       setFilterType(VehicleType.MOTOR);
                     } else if (chip.id === 'mobil') {
                       setFilterType(VehicleType.MOBIL);
                     } else if (chip.id === 'near') {
                       setNearbyFilter(!nearbyFilter);
                     } else if (chip.id === 'verified') {
                       // Visual mock for verified
                     }
                   }}
                   className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest whitespace-nowrap transition-all border shadow-sm ${
                     (chip.id === 'all' && filterType === 'all' && filterPrice === 'all' && !nearbyFilter) || 
                     (chip.id === 'cheap' && filterPrice === 'low') || 
                     (chip.id === 'motor' && filterType === VehicleType.MOTOR) ||
                     (chip.id === 'mobil' && filterType === VehicleType.MOBIL) ||
                     (chip.id === 'near' && nearbyFilter)
                       ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200' 
                       : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:text-emerald-700'
                   }`}
                 >
                   <chip.icon className="w-4 h-4" />
                   {chip.label}
                 </button>
               ))}
            </div>

          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-[2.5rem] h-80 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredSpots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpots.map(spot => (
                <SpotCard 
                  key={spot.id} 
                  spot={spot} 
                  onClick={() => setSelectedSpot(spot)} 
                />
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2">Lahan Tidak Ditemukan</h4>
              <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">Coba gunakan kata kunci lain atau hapus beberapa filter pencarian.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterPrice('all');
                  setFilterAvailability('all');
                }}
                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
              >
                Reset Pencarian
              </button>
            </div>
          )}

        </main>

        {/* Sidebar - Live Activity */}
        <aside className="w-full lg:w-[380px] border-l border-slate-200 bg-white/50 backdrop-blur-md p-4 md:p-6 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] overflow-y-auto">
          <LiveActivityFeed activities={liveActivities} />
          
          <div className="mt-12 p-6 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                   <Zap className="w-8 h-8 text-emerald-400 fill-current" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight mb-2">Ingin Jadi Mitra?</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">Daftarkan lahan parkir kosong Anda dan dapatkan penghasilan tambahan.</p>
                <Link to="/register-spot">
                  <Button className="w-full rounded-2xl bg-white text-slate-900 hover:bg-emerald-500 hover:text-white transition-all py-4">Buka Garasi Sekarang</Button>
                </Link>
             </div>
          </div>
        </aside>
      </div>

      {/* Selected Spot Detail Modal */}
      <AnimatePresence>
        {selectedSpot && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedSpot(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-50 transition-colors font-bold text-xl"
              >
                &times;
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <ImageWithFallback 
                  src={selectedSpot.images[0]} 
                  alt={selectedSpot.name}
                  fallbackSrc="https://via.placeholder.com/800x600/059669/FFFFFF?text=GarasiKu+Spot"
                />
              </div>

              <div className="p-8 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                   <div className={`w-2 h-2 rounded-full ${selectedSpot.crowdLevel === 'High' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedSpot.crowdLevel} Density • {selectedSpot.occupancyRate}% Full</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedSpot.name}</h2>
                <p className="text-sm text-slate-500 font-medium mb-8 italic">"{selectedSpot.description}"</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Harga Sewa</p>
                    <p className="text-xl font-black text-slate-900">Rp{selectedSpot.pricePerHour.toLocaleString()}/jam</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Exit Efficiency</p>
                    <p className="text-xl font-black text-emerald-600">{selectedSpot.exitEfficiency}%</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 w-fit">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest">{selectedSpot.walkingDistance || '300m'} dari lokasi</span>
                  </div>
                  <Button 
                    className="w-full rounded-2xl h-16 font-black text-lg uppercase tracking-tight gap-3 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all duration-300" 
                    onClick={() => {
                      const { lat, lng } = selectedSpot.coordinates;
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                    }}
                  >
                    <Compass className="w-6 h-6 text-white" />
                    Buka di Maps
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <MobileBottomNav />
    </div>
  );
}

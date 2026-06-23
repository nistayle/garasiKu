/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Users, TrendingUp, Clock, Info, ShieldCheck, MapPin, Ticket, Flame, Sparkles } from 'lucide-react';
import { ParkingSpot, LiveActivity } from '../types';
import { ImageWithFallback } from './UI';

export const AIRecommendationCard = ({ spot }: { spot: ParkingSpot }) => {
  if (!spot) return null;

  const savings = (100 - (spot.exitEfficiency || 92)) * 2 + 10;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 animate-gradient-x" />
      <div className="relative bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-[2.5rem] p-8 shadow-xl shadow-emerald-500/5">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">🤖 AI Exit Recommendation</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Best Parking for Faster Exit</p>
            </div>
          </div>
          <div className="bg-emerald-600 px-4 py-2 rounded-2xl shadow-lg shadow-emerald-200">
             <span className="text-xs font-black text-white uppercase tracking-widest">{spot.exitEfficiency || 92}% Score</span>
          </div>
        </div>

        <div className="bg-emerald-50/50 rounded-[2rem] p-6 mb-6 border border-emerald-100/50 relative">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Efficiency Insight</div>
          <p className="text-base font-medium text-slate-700 leading-relaxed italic">
            "Area <span className="text-slate-950 font-black">{spot.address.split(',')[0]}</span> diprediksi <span className="text-emerald-600 font-[950] underline decoration-emerald-200 underline-offset-4">{savings}% lebih cepat</span> keluar setelah event selesai karena akses langsung ke jalan arteri utama."
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Savings</p>
            <div className="flex items-center gap-2">
               <Clock className="w-4 h-4 text-emerald-500" />
               <span className="text-sm font-black text-slate-900">~{savings} Mins</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Exit Crowd</p>
            <div className="flex items-center gap-2">
               <Users className="w-4 h-4 text-blue-500" />
               <span className="text-sm font-black text-slate-900">Low Density</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Traffic Flow</p>
            <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-orange-500" />
               <span className="text-sm font-black text-slate-900">Optimized</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Safety</p>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-sm font-black text-slate-900">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CrowdStatus = ({ spot }: { spot: ParkingSpot }) => {
  const level = spot.crowdLevel || 'Low';
  const colors = {
    Low: 'bg-emerald-500',
    Medium: 'bg-orange-500',
    High: 'bg-red-500'
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
        <Flame className={`w-3.5 h-3.5 ${level === 'High' ? 'text-red-500' : level === 'Medium' ? 'text-orange-500' : 'text-emerald-500'}`} />
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Live Crowd: {level}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${colors[level]}`} />
          <div className={`absolute inset-0 w-2 h-2 rounded-full ${colors[level]} animate-ping opacity-75`} />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{spot.occupancyRate || 20}% Occupancy</span>
      </div>
    </div>
  );
};

export const LiveActivityFeed = ({ activities, isCompact }: { activities: LiveActivity[], isCompact?: boolean }) => {
  if (isCompact) {
    const [currentIdx, setCurrentIdx] = React.useState(0);
    const validActivities = activities || [];

    React.useEffect(() => {
      if (validActivities.length === 0) return;
      const timer = setInterval(() => {
        setCurrentIdx((prev) => (prev + 1) % validActivities.length);
      }, 4000);
      return () => clearInterval(timer);
    }, [validActivities.length]);

    if (validActivities.length === 0) return null;

    return (
      <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl px-6 py-2 shadow-xl flex items-center gap-4 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
        </div>
        <div className="h-5 overflow-hidden flex-1 relative min-w-[180px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIdx}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              className="text-[11px] font-bold text-slate-700 whitespace-nowrap"
            >
              {validActivities[currentIdx]?.message}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Aktivitas Langsung
        </h3>
        <span className="text-[10px] font-bold text-slate-400">Terupdate Detik Ini</span>
      </div>
      <div className="flex flex-col gap-2">
        {activities.map((activity) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
              activity.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-800' : 
              activity.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              'bg-slate-50 border-slate-100 text-slate-600'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
               activity.type === 'warning' ? 'bg-orange-500 text-white' : 
               activity.type === 'success' ? 'bg-emerald-500 text-white' :
               'bg-slate-900 text-white'
            }`}>
              {activity.type === 'warning' ? <TrendingUp className="w-3 h-3" /> : <Info className="w-3 h-3" />}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-medium leading-tight">{activity.message}</p>
              <p className="text-[9px] font-bold opacity-50 mt-1 uppercase">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const EventDiscoverCard = ({ event }: { event: any }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-32 overflow-hidden">
        <ImageWithFallback 
          src={event.image} 
          alt={event.name} 
          className="group-hover:scale-110 transition-transform duration-700" 
          fallbackSrc="https://via.placeholder.com/600x400/059669/FFFFFF?text=Event+GarasiKu"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/30">
          <span className="text-[8px] font-black text-white uppercase">{event.category}</span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <MapPin className="w-3 h-3" />
          <span className="text-[10px] font-bold truncate">{event.city}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-900 leading-tight mb-1 line-clamp-1">{event.name}</h4>
          <p className="text-[10px] font-medium text-slate-500 line-clamp-2">{event.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <Ticket className="w-3 h-3 text-blue-500" />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                <p className="text-[10px] font-bold text-slate-700">{event.expectedCrowd} Crowd</p>
              </div>
           </div>
           <button className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-500 transition-colors">
              <Zap className="w-3.5 h-3.5 fill-current" />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

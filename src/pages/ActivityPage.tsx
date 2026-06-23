import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  History, 
  Bell, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Navigation, 
  MapPin, 
  ChevronRight,
  Flame,
  Star,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AuthenticatedNavbar } from '../components/AuthenticatedNavbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { eventService } from '../services/eventService';
import { LiveActivity } from '../types';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/UI';

const ActivityCard = ({ activity }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group cursor-pointer"
  >
    <div className="flex gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${
        activity.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
        activity.type === 'warning' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
        'bg-blue-50 text-blue-600 border-blue-100'
      }`}>
        {activity.type === 'success' ? <ShieldCheck className="w-7 h-7" /> : 
         activity.type === 'warning' ? <Flame className="w-7 h-7" /> : 
         <Activity className="w-7 h-7" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
           <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
             activity.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 
             activity.type === 'warning' ? 'bg-orange-100 text-orange-700' : 
             'bg-blue-100 text-blue-700'
           }`}>
             {activity.type === 'success' ? 'Confirmed' : activity.type === 'warning' ? 'Live Alert' : 'Update'}
           </span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.timestamp}</span>
        </div>
        <p className="text-lg font-bold text-slate-900 leading-tight mb-4 group-hover:text-emerald-700 transition-colors">
          {activity.message}
        </p>
        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
           <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sekitar Area GBK</span>
           </div>
           <button className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-auto flex items-center gap-1 hover:gap-2 transition-all">
             Detail <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const HistoryItem = ({ id, name, location, price, date, rating }: any) => (
  <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
     <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
        <ImageWithFallback 
          src={`https://images.unsplash.com/photo-1506521781263-d8422e8ecf27?q=80&w=200&auto=format&fit=crop&u=${id}`} 
          className="group-hover:scale-110 transition-transform" 
          alt={name} 
        />
     </div>
     <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-slate-900 truncate leading-none mb-1 group-hover:text-emerald-600 transition-colors">{name}</h4>
        <p className="text-xs font-medium text-slate-500 truncate mb-2">{location}</p>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
           <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-black text-slate-900">{rating}</span>
           </div>
        </div>
     </div>
     <div className="text-right">
        <p className="text-sm font-black text-slate-900 leading-none mb-1">Rp{price.toLocaleString()}</p>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100">
           <CheckCircle2 className="w-2.5 h-2.5" /> Berhasil
        </div>
     </div>
  </div>
);

export default function ActivityPage() {
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'aktivitas' | 'riwayat'>('aktivitas');

  useEffect(() => {
    setActivities(eventService.getLiveActivity());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      <AuthenticatedNavbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white mb-6 md:mb-8 shadow-2xl shadow-emerald-600/20">
                <Activity className="w-8 h-8 md:w-10 md:h-10" />
             </div>
             <h1 className="text-3xl md:text-6xl font-[950] text-slate-950 tracking-tighter mb-4 leading-[1.1]">
               Aktivitas <br />
               <span className="text-emerald-600 italic">& Updates ⚡</span>
             </h1>
             <p className="text-sm md:text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
               Pantau riwayat parkir Anda dan dapatkan update realtime tentang crowd status di sekitar event favorit Anda.
             </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 md:p-1.5 bg-slate-200 rounded-[1.5rem] md:rounded-[2rem] mb-8 md:mb-12 relative overflow-hidden">
             <button 
               onClick={() => setActiveTab('aktivitas')}
               className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.75rem] text-[10px] md:text-sm font-black uppercase tracking-widest transition-all relative z-10 ${
                 activeTab === 'aktivitas' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'
               }`}
             >
                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="truncate">Realtime</span>
             </button>
             <button 
               onClick={() => setActiveTab('riwayat')}
               className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.75rem] text-[10px] md:text-sm font-black uppercase tracking-widest transition-all relative z-10 ${
                 activeTab === 'riwayat' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'
               }`}
             >
                <History className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="truncate">Riwayat</span>
             </button>
             <motion.div 
               layoutId="activeTab"
               className="absolute top-1 bottom-1 md:top-1.5 md:bottom-1.5 left-1 md:left-1.5 w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] bg-white rounded-[1.25rem] md:rounded-[1.75rem] shadow-sm z-0"
               animate={{ x: activeTab === 'aktivitas' ? 0 : '100%' }}
               transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
             />
          </div>

          {activeTab === 'aktivitas' ? (
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4 mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Update Hari Ini</h3>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Engine Active</span>
                  </span>
               </div>
               {activities.map((activity) => (
                 <ActivityCard key={activity.id} activity={activity} />
               ))}
               
               {/* AI Advice Card */}
               <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 text-white relative overflow-hidden mt-8 md:mt-12">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                     <Zap className="w-48 h-48" />
                  </div>
                  <div className="relative z-10 flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
                     <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                        <AlertCircle className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" />
                     </div>
                     <div className="text-center lg:text-left">
                        <h4 className="text-xl md:text-2xl font-black tracking-tight mb-2">Smart Prediction AI</h4>
                        <p className="text-sm md:text-lg text-emerald-100/70 font-medium leading-relaxed">
                           Sistem mendeteksi lonjakan volume di area <span className="text-white font-black">Sudirman</span>. Kami menyarankan untuk mencari parkir di <span className="text-white font-black">Area C - Manggarai</span>.
                        </p>
                     </div>
                     <Link to="/find" className="w-full lg:w-auto">
                        <button className="w-full lg:w-auto bg-white text-slate-950 px-8 h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-emerald-400 transition-all whitespace-nowrap">Cek Area Sekarang</button>
                     </Link>
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-4 h-full min-h-[600px] flex flex-col">
               <div className="p-6 border-b border-slate-50 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Penggunaan</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total 24 Booking Tahun Ini</p>
                  </div>
                  <button className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                     <Clock className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="space-y-2 flex-1 px-2">
                  <HistoryItem 
                    id="1"
                    name="Parkir Malioboro Mall"
                    location="Jl. Malioboro No.52, Yogyakarta"
                    price={15000}
                    date="14 Mei 2026"
                    rating={4.8}
                  />
                  <HistoryItem 
                    id="2"
                    name="Garasi Pak Budi - GBK"
                    location="Senayan, Jakarta Pusat"
                    price={35000}
                    date="12 Mei 2026"
                    rating={4.9}
                  />
                  <HistoryItem 
                    id="3"
                    name="Lahan Kosong Dr. Mansyur"
                    location="Medan, Sumatra Utara"
                    price={10000}
                    date="10 Mei 2026"
                    rating={4.5}
                  />
                  <HistoryItem 
                    id="4"
                    name="Parkir Stasiun Tugu"
                    location="Yogyakarta"
                    price={12000}
                    date="05 Mei 2026"
                    rating={4.7}
                  />
                  <HistoryItem 
                    id="5"
                    name="Spot Festival Jazz"
                    location="Sentul, Bogor"
                    price={45000}
                    date="28 April 2026"
                    rating={5.0}
                  />
               </div>
               
               <button className="w-full py-8 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 border-t border-slate-50 mt-4">
                 Muat Lebih Banyak <History className="w-3 h-3" />
               </button>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

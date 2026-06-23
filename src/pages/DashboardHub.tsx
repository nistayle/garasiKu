import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  Search, 
  PlusCircle, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Calendar,
  Activity,
  Sparkles,
  Navigation,
  Clock,
  Heart,
  Ticket,
  Flame,
  ChevronRight,
  LogOut,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { Button, ImageWithFallback } from '../components/UI';
import { eventService } from '../services/eventService';
import { CityEvent, LiveActivity, ParkingSpot } from '../types';
import { AuthenticatedNavbar } from '../components/AuthenticatedNavbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { parkingService } from '../services/parkingService';

const QuickActionCard = ({ title, desc, icon: Icon, color, path }: any) => (
  <Link to={path} className="group">
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 h-full flex flex-col gap-4">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">{title}</h3>
        <p className="text-sm font-medium text-slate-500 leading-tight">{desc}</p>
      </div>
    </div>
  </Link>
);

const UserStatsWidget = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 group hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-current" />
      </div>
      {trend && (
        <span className={`text-[10px] font-black uppercase tracking-widest ${trend > 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ activity }: any) => (
  <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
      activity.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 
      activity.type === 'warning' ? 'bg-orange-50 text-orange-600' : 
      'bg-blue-50 text-blue-600'
    }`}>
      {activity.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : 
       activity.type === 'warning' ? <Flame className="w-5 h-5" /> : 
       <Activity className="w-5 h-5" />}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
        {activity.message}
      </p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
        {activity.timestamp}
      </p>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
  </div>
);

export default function DashboardHub() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [mySpots, setMySpots] = useState<ParkingSpot[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn') === 'true';
    if (!auth) {
      navigate('/');
      return;
    }
    setIsLoggedIn(true);
    setEvents(eventService.getEvents().slice(0, 4));
    setActivities(eventService.getLiveActivity().slice(0, 5));
    // Simulate user having a spot for the demo if they are logged in
    setMySpots(parkingService.getSpots().slice(0, 1)); 
  }, [navigate]);

  if (!isLoggedIn) return null;

  const isOwner = mySpots.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-40 lg:pb-0">
      <AuthenticatedNavbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* LEFT CONTENT: Overview & Profile */}
          <div className="lg:col-span-8 flex flex-col gap-8 md:gap-10">
            
            {/* HERO / WELCOME */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                  <Sparkles className="w-64 h-64" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center flex-wrap gap-3 mb-6 md:mb-8">
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                      Verified Member Hub
                    </span>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-6xl font-[950] text-slate-950 tracking-tighter mb-4 leading-[1.1] md:leading-[1.1]">
                    Selamat Datang Kembali, <br className="hidden md:block" />
                    <span className="text-emerald-600 italic">Garasi Member 👋</span>
                  </h1>
                  
                  <p className="text-base md:text-xl text-slate-500 font-medium max-w-xl mb-8 md:mb-10 leading-relaxed">
                    Cari parkir event lebih cepat hari ini atau kelola lahan Anda untuk menambah penghasilan tambahan.
                  </p>

                  <div className="flex flex-wrap gap-3 md:gap-4 pt-6 md:pt-8 border-t border-slate-100">
                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">3 Event Ramai Searah</span>
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">AI Focus Active</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* QUICK STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <UserStatsWidget 
                icon={Ticket} 
                label="Event Di Sekitar" 
                value="12" 
                trend={15} 
                color="text-blue-600 bg-blue-50"
               />
               <UserStatsWidget 
                icon={Heart} 
                label="Spot Favorit" 
                value="08" 
                color="text-rose-600 bg-rose-50"
               />
               <UserStatsWidget 
                icon={Activity} 
                label="Total Booking" 
                value="24" 
                trend={5} 
                color="text-emerald-600 bg-emerald-50"
               />
               <UserStatsWidget 
                icon={TrendingUp} 
                label="Total Saldo" 
                value="850k" 
                trend={22} 
                color="text-indigo-600 bg-indigo-50"
               />
            </section>

            {/* SMART QUICK ACTIONS */}
            <section>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-6 px-2 flex items-center gap-3">
                 <Zap className="w-5 h-5 text-emerald-600" /> Smart Actions
               </h2>
               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <QuickActionCard 
                  title="Cari Parkir" 
                  desc="Temukan spot terdekat via AI"
                  icon={Search}
                  color="bg-slate-900"
                  path="/find"
                 />
                 <QuickActionCard 
                  title="Buka Lahan" 
                  desc="Daftarkan garasi rumah Anda"
                  icon={PlusCircle}
                  color="bg-emerald-600"
                  path="/register-spot"
                 />
                 <QuickActionCard 
                  title="Event Hari Ini" 
                  desc="Cek kemacetan & jadwal"
                  icon={Calendar}
                  color="bg-indigo-600"
                  path="/#events"
                 />
                 <QuickActionCard 
                  title="Favorit Saya" 
                  desc="Lihat spot yang disimpan"
                  icon={Heart}
                  color="bg-rose-600"
                  path="/favorites"
                 />
               </div>
            </section>

            {/* AI PERSONALIZATION / RECOMMENDATIONS */}
            <section className="bg-emerald-950 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden group mt-4">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-white/10">
                       <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 md:mb-6">Parking Assistant AI</h2>
                    <p className="text-emerald-100/70 font-medium text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                       Berdasarkan kebiasaan Anda, area <span className="text-white font-black underline decoration-emerald-500 decoration-2 underline-offset-4">KM 0 Yogyakarta</span> diprediksi akan sangat ramai malam ini. Amankan spot Anda 6 jam sebelum event dimulai.
                    </p>
                    <Link to="/find">
                      <Button className="w-full md:w-auto bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-xl md:rounded-2xl px-8 h-12 md:h-14 font-black uppercase tracking-widest text-[11px] md:text-xs shadow-xl shadow-emerald-500/20">Amankan Spot Sekarang</Button>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                     <div className="space-y-4">
                        {[
                          { label: "Crowd Prediction", val: "High Traffic Expectation", color: "text-orange-400" },
                          { label: "Smart Exit Advice", val: "Use North Arterial Road", color: "text-emerald-400" },
                          { label: "Available Hosts", val: "12 Locals Active Now", color: "text-blue-400" }
                        ].map((item, idx) => (
                          <div key={idx} className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between group-hover:bg-white/10 transition-colors">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.label}</p>
                                <p className={`text-sm font-black ${item.color}`}>{item.val}</p>
                             </div>
                             <ChevronRight className="w-4 h-4 opacity-20" />
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR: Activity & Owner Hub */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            
            {/* OWNER HUB (DYNAMISM) */}
            {isOwner && (
              <section>
                 <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-700">
                       <LayoutDashboard className="w-32 h-32" />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mitra Garasi</h3>
                       <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Hub</span>
                       </div>
                    </div>
                    
                    <div className="space-y-6 mb-10">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                <Home className="w-5 h-5 flex-shrink-0" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Lahan Utama</p>
                                <p className="text-sm font-black text-slate-900 tracking-tight">{mySpots[0].name}</p>
                             </div>
                          </div>
                          <Link to="/owner-dashboard" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors shadow-sm">
                             <Settings className="w-4 h-4" />
                          </Link>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                             <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">Income Hari Ini</p>
                             <p className="text-xl font-black text-emerald-900 leading-none tracking-tighter">Rp 125rb</p>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                             <p className="text-[9px] font-black text-indigo-600/60 uppercase tracking-widest mb-1">Total Booking</p>
                             <p className="text-xl font-black text-indigo-900 leading-none tracking-tighter">04 Spot</p>
                          </div>
                       </div>
                    </div>

                    <Link to="/owner-dashboard">
                       <Button variant="secondary" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-xl shadow-slate-900/10">
                          Management Hub <ArrowRight className="w-4 h-4" />
                       </Button>
                    </Link>
                 </div>
              </section>
            )}

            {/* USER ACTIVITY FEED */}
            <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-full max-h-[500px] overflow-hidden">
               <div className="flex items-center justify-between mb-8 px-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Aktivitas Saya</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-lg">Realtime</div>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
               </div>
               
               <button className="w-full py-5 mt-6 text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.3em] transition-colors border-t border-slate-50 flex items-center justify-center gap-2">
                 Semua Aktivitas <ArrowRight className="w-3 h-3" />
               </button>
            </section>

            {/* HOT EVENT SUGGESTION */}
            <section>
               <div className="bg-slate-900 rounded-[3rem] p-8 text-white group overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none opacity-50"></div>
                  <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                     <Flame className="w-48 h-48" />
                  </div>
                  
                  <h3 className="text-xl font-black mb-6 relative z-10 flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-500" /> Hot Events
                  </h3>
                  
                  <div className="space-y-4 relative z-10">
                     {events.slice(0, 2).map((event) => (
                       <div key={event.id} className="flex gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-white/5 group-hover:border-white/10">
                          <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 shadow-lg">
                             <ImageWithFallback src={event.image} alt={event.name} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-black text-white truncate leading-tight mb-1">{event.name}</p>
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${event.expectedCrowd === 'High' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{event.expectedCrowd} Crowd</span>
                             </div>
                             <p className="text-[10px] font-bold text-emerald-400">{event.date}</p>
                          </div>
                       </div>
                     ))}
                  </div>

                  <Link to="/find" className="relative z-10 block text-center mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 hover:text-white transition-colors">
                     JELAJAHI SEMUA
                  </Link>
               </div>
            </section>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

const Home = (props: any) => <Activity {...props} />

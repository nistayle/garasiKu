import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  Filter,
  Music,
  Tent,
  Trophy,
  ShoppingBag,
  Palette,
  ChevronRight,
  TrendingUp,
  Map,
  Clock
} from 'lucide-react';
import { AuthenticatedNavbar } from '../components/AuthenticatedNavbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { eventService } from '../services/eventService';
import { CityEvent } from '../types';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/UI';

const categories = [
  { name: 'Semua', icon: Calendar, color: 'bg-slate-900' },
  { name: 'Konser', icon: Music, color: 'bg-indigo-600' },
  { name: 'Festival', icon: Tent, color: 'bg-emerald-600' },
  { name: 'Olahraga', icon: Trophy, color: 'bg-orange-600' },
  { name: 'Bazaar', icon: ShoppingBag, color: 'bg-rose-600' },
  { name: 'Budaya', icon: Palette, color: 'bg-amber-600' },
];

const EventCard = ({ event }: any) => (
  <Link to={`/find?eventId=${event.id}`} className="group block">
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 group-hover:-translate-y-1">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <ImageWithFallback 
          src={event.image} 
          alt={event.name} 
          className="group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
            {event.category}
          </span>
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${
            event.expectedCrowd === 'High' ? 'bg-orange-600' : 'bg-emerald-600'
          }`}>
            {event.expectedCrowd} Crowd
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
            {event.name}
          </h3>
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100">
             <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Mei</span>
             <span className="text-lg font-black text-slate-900 leading-none tracking-tighter">
               {event.date.split(' ')[0]}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-500 mb-6">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold">{event.city}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold">{event.time.split(' - ')[0]}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
           <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <ImageWithFallback src={`https://i.pravatar.cc/100?u=ev${event.id}${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">2.4k+ Attending</span>
           </div>
           <div className="flex items-center gap-1 text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
             Cari Parkir <ChevronRight className="w-4 h-4" />
           </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<CityEvent[]>([]);

  useEffect(() => {
    setEvents(eventService.getEvents());
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesCategory = activeCategory === 'Semua' || e.category === activeCategory;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      <AuthenticatedNavbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
           <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                City Pulse Discover
              </span>
           </div>
           <h1 className="text-3xl md:text-6xl font-[950] text-slate-950 tracking-tighter mb-4 leading-[1.1]">
             Eksplorasi <br />
             <span className="text-emerald-600">Event Terdekat 🎪</span>
           </h1>
           <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
             Temukan konser, festival, dan pameran seru di kota Anda lengkap dengan prediksi kemacetan dan spot parkir cerdas.
           </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="relative group max-w-2xl w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Cari event atau lokasi spesifik..."
              className="w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-bold text-slate-700 text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:-mx-6 md:px-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
                  activeCategory === cat.name 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10 -translate-y-1' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:text-slate-900'
                }`}
              >
                <cat.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeCategory === cat.name ? 'text-emerald-400' : 'text-slate-400'}`} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-20">
          
          {/* Trending Events */}
          <section>
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending Event</h2>
                </div>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">Lihat Semua</button>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredEvents.slice(0, 3).map(event => (
                 <EventCard key={event.id} event={event} />
               ))}
               {filteredEvents.length === 0 && (
                 <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-100">
                    <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">Event Tidak Ditemukan</h3>
                    <p className="text-slate-400 font-medium">Coba gunakan kata kunci lain atau kategori yang berbeda.</p>
                 </div>
               )}
             </div>
          </section>

          {/* Near You / Map Preview */}
          <section className="bg-slate-950 rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 lg:p-20 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 md:mb-10 border border-white/10">
                     <Map className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">
                    Lihat Event <br /> Melalui <span className="text-emerald-500 italic">Smart Map 🗺️</span>
                  </h2>
                  <p className="text-emerald-100/70 font-medium text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                    Temukan pusat kemacetan secara visual dan cari jalur alternatif terbaik menuju event favorit Anda dengan bantuan AI GarasiKu.
                  </p>
                  <Link to="/find" className="w-full lg:w-auto">
                    <button className="w-full lg:w-auto bg-white text-slate-950 px-10 h-14 md:h-16 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-emerald-400 hover:scale-105 transition-all shadow-2xl shadow-white/5">Buka Interactive Map</button>
                  </Link>
                </div>

                <div className="relative group">
                   <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="bg-slate-900 p-4 rounded-[2.5rem] border border-white/10 relative overflow-hidden aspect-video">
                      <ImageWithFallback 
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop" 
                        className="opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-700"
                        alt="Map"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-emerald-600/50">
                            <MapPin className="w-6 h-6 text-white" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* This Week */}
          <section>
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gak Boleh Kelewatan</h2>
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-8">
                {filteredEvents.slice(2, 4).map(event => (
                  <div key={event.id} className="bg-white group cursor-pointer p-2 rounded-[3rem] border border-slate-100 flex flex-col sm:flex-row gap-6 hover:border-emerald-200 hover:shadow-xl transition-all">
                     <div className="sm:w-48 h-48 rounded-[2.5rem] overflow-hidden shrink-0 relative">
                        <ImageWithFallback src={event.image} className="group-hover:scale-110 transition-transform duration-700" alt={event.name} />
                     </div>
                     <div className="p-4 sm:pt-6">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3 inline-block">Trending ⚡</span>
                        <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">{event.name}</h4>
                        <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
                           <MapPin className="w-4 h-4" /> {event.location.split(',')[0]}
                        </p>
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tanggal</p>
                              <p className="text-sm font-black text-slate-900">{event.date}</p>
                           </div>
                           <Link to={`/find?eventId=${event.id}`} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg">
                              <Search className="w-5 h-5" />
                           </Link>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </section>

        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

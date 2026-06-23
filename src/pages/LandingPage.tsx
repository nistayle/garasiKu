/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight,
  Star,
  Users,
  Menu,
  X,
  Calendar,
  AlertCircle,
  Home,
  Sparkles,
  Navigation,
  Activity,
  Check,
  TrendingUp,
  Search,
  PlusCircle,
  Car,
  Ticket,
  Flame
} from 'lucide-react';
import { Button, SectionHeading, ImageWithFallback } from '../components/UI';
import { eventService } from '../services/eventService';
import { LiveActivityFeed } from '../components/SmartFeatures';
import { CityEvent, LiveActivity } from '../types';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  // Mock check for auth status
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleMitraClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/register-spot');
    } else {
      navigate('/login', { state: { redirectTo: '/register-spot', from: 'register' } });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-md border-b border-white/10 px-4 md:px-8 py-3 md:py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-[1000] group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-200">G</div>
          <span className="text-xl font-[1000] text-slate-950 tracking-tighter uppercase">Garasi<span className="text-emerald-600">Ku</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link to="/find" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Cari Parkir</Link>
          <button 
            onClick={handleMitraClick}
            className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Sewakan Lahan
          </button>
          <a href="#how-it-works" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">Cara Kerja</a>
          
          <div className="flex items-center gap-4 ml-6 pl-10 border-l border-slate-200">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-900 hover:text-emerald-600 transition-colors">Masuk</Link>
                <Button 
                  onClick={handleMitraClick}
                  variant="primary" 
                  size="sm" 
                  className="px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-100"
                >
                  Gabung Mitra
                </Button>
              </>
            ) : (
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        <button className="md:hidden p-2 text-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 p-8 space-y-6 overflow-hidden"
          >
            <Link to="/find" className="block text-2xl font-black text-slate-900 uppercase tracking-tighter">Cari Parkir</Link>
            <button 
              onClick={handleMitraClick}
              className="block w-full text-left text-2xl font-black text-slate-900 uppercase tracking-tighter"
            >
              Sewakan Lahan
            </button>
            <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
              {!isLoggedIn ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest">Masuk</Button>
                  </Link>
                  <Button onClick={handleMitraClick} className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest">Gabung Mitra</Button>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button className="w-full h-16 rounded-[2rem] font-black uppercase tracking-widest">Dashboard Hub</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ liveActivities }: { liveActivities: LiveActivity[] }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleMitraClick = () => {
    if (isLoggedIn) {
      navigate('/register-spot');
    } else {
      navigate('/login', { state: { redirectTo: '/register-spot', from: 'register' } });
    }
  };

  return (
    <section className="relative pt-24 md:pt-48 pb-16 md:pb-32 overflow-hidden bg-[#FAF9F6]">
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[180px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/3 pointer-events-none opacity-60"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="lg:w-[55%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6 md:mb-10">
                <span className="px-5 py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-emerald-200">Community-Powered</span>
                <div className="max-w-md w-full md:w-auto">
                   <LiveActivityFeed activities={liveActivities} isCompact />
                </div>
              </div>

              <h1 className="text-5xl md:text-8xl lg:text-9xl font-[950] text-slate-950 mb-6 md:mb-10 leading-[0.95] md:leading-[0.9] tracking-[-0.05em]">
                Parkir Event <br />
                <span className="text-emerald-600 italic text-4xl md:text-8xl lg:text-9xl">Smart & Lokal.</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-slate-500 font-medium max-w-2xl mb-8 md:mb-14 leading-relaxed tracking-tight">
                Temukan <span className="text-slate-900 font-black underline decoration-emerald-500 decoration-4 underline-offset-8">AI-optimized parking</span> dari warga lokal untuk konser & festival dengan fitur <span className="text-orange-500">Live Crowd Status</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-12 md:mb-20 size-full">
                <Link to="/find" className="w-full sm:w-auto h-16 md:h-24">
                  <Button size="lg" icon={MapPin} className="w-full h-full text-lg md:text-2xl font-black rounded-2xl md:rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(5,150,105,0.25)] md:shadow-[0_30px_60px_-15px_rgba(5,150,105,0.3)] uppercase tracking-widest transition-all active:scale-95 group">
                    Cari Parkir <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Button 
                  onClick={handleMitraClick}
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-16 md:h-24 text-lg md:text-2xl font-black rounded-2xl md:rounded-[2.5rem] border-2 border-slate-200 bg-white hover:border-emerald-600 hover:text-emerald-600 shadow-xl shadow-slate-100 uppercase tracking-widest"
                >
                  Sewakan Lahan
                </Button>
              </div>

            <div className="grid grid-cols-3 gap-6 md:gap-12 pt-10 md:pt-16 border-t border-slate-200/60 max-w-2xl">
              <div className="group">
                <h4 className="text-4xl md:text-5xl font-black text-slate-950 leading-none group-hover:text-emerald-600 transition-colors">2.4k+</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Smart Users</p>
              </div>
              <div className="group">
                <h4 className="text-4xl md:text-5xl font-black text-slate-950 leading-none group-hover:text-emerald-600 transition-colors">15+</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Cities</p>
              </div>
              <div className="group">
                <h4 className="text-4xl md:text-5xl font-black text-slate-950 leading-none group-hover:text-emerald-600 transition-colors">98%</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Safety Score</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:w-[45%] w-full relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Visual Representation of App/Community */}
            <div className="absolute -inset-10 bg-emerald-400/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="relative z-10 bg-white rounded-[4rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-4 border-white group">
               <div className="rounded-[3rem] overflow-hidden aspect-[4/5]">
                  <ImageWithFallback 
                    src="https://images.pexels.com/photos/1364560/pexels-photo-1364560.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Pusat Parkir GarasiKu yang Modern dan Aman" 
                    className="grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    fallbackSrc="https://via.placeholder.com/800x1000/059669/FFFFFF?text=GarasiKu+Community"
                  />
               </div>
               
               {/* Floating Dashboard Widget - AI Recommendation */}
               <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-4 md:top-12 md:-left-8 bg-white/90 backdrop-blur-2xl p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col gap-3 min-w-[180px] md:min-w-[240px] z-20"
               >
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-xl">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                     </div>
                     <div>
                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">AI EXIT ADVISOR</p>
                        <p className="text-xs md:text-sm font-black text-slate-900 tracking-tight leading-none">Akses Keluar 40% Lebih Cepat</p>
                     </div>
                  </div>
                  <div className="h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="w-[85%] h-full bg-emerald-500"></div>
                  </div>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-500 leading-tight italic">"Gunakan Area Utara untuk menghindari crowd gate utama."</p>
               </motion.div>

               {/* Floating Live Indicator - Crowd Status */}
               <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-4 md:bottom-12 md:-right-8 bg-slate-900 text-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center gap-4 md:gap-6 z-20"
               >
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-500 rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-xl">
                     <Flame className="w-5 h-5 md:w-7 md:h-7" />
                  </div>
                  <div>
                     <p className="text-[8px] md:text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">LIVE CROWD LEVEL</p>
                     <p className="text-base md:text-xl font-black tracking-tight leading-none underline decoration-orange-500 underline-offset-4">High Availability</p>
                  </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Pilih Event",
      desc: "Pilih konser atau festival. AI kami akan memetakan lahan warga terdekat secara otomatis.",
      icon: Ticket,
      color: "bg-emerald-50 text-emerald-600",
      number: "01"
    },
    {
      title: "AI Exit Advisor",
      desc: "Dapatkan rekomendasi spot parkir dengan rute keluar tercepat setelah event selesai.",
      icon: Sparkles,
      color: "bg-indigo-50 text-indigo-600",
      number: "02"
    },
    {
      title: "Live Crowd Monitor",
      desc: "Pantau kepadatan lahan secara realtime sebelum berangkat ke lokasi venue.",
      icon: Flame,
      color: "bg-orange-50 text-orange-600",
      number: "03"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
           <span className="px-5 py-2.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-6 md:mb-8">Process & Intelligence</span>
           <h2 className="text-4xl md:text-7xl font-[950] text-slate-950 tracking-tighter mb-4">Smart Parking Ecosystem</h2>
           <p className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl">Misi kami adalah menyederhanakan mobilitas urban Anda di setiap keramaian kota menggunakan teknologi AI dan ekonomi berbagi.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16 relative">
           <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 hidden md:block -translate-y-1/2"></div>
           
           {steps.map((step, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.2 }}
               className="relative group"
             >
                <div className="relative z-10 p-12 bg-white border-2 border-slate-50 rounded-[3.5rem] group-hover:border-emerald-100 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-500">
                   <div className="absolute -top-6 left-12 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-black tracking-widest">{step.number}</div>
                   <div className={`w-20 h-20 ${step.color} rounded-[2rem] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                      <step.icon className="w-10 h-10" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-950 mb-4 tracking-tight leading-none">{step.title}</h3>
                   <p className="text-slate-500 font-medium text-lg leading-relaxed">{step.desc}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const ComparisonSection = () => (
  <section className="py-32 bg-slate-50 relative overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center text-center mb-24">
         <span className="px-5 py-2.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-8">Problem vs Solution</span>
         <h2 className="text-5xl md:text-7xl font-[950] text-slate-950 tracking-tighter mb-4">Ubah Pengalaman Parkir</h2>
         <p className="text-slate-500 font-medium text-xl max-w-2xl">Bandingkan bagaimana GarasiKu menyelesaikan masalah parkir event tradisional secara tuntas.</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-10 mt-16 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-12 rounded-[4rem] border-2 border-red-50 relative overflow-hidden flex flex-col h-full"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <X className="w-48 h-48 text-red-600" />
          </div>
          <h4 className="text-2xl font-black text-red-600 mb-12 flex items-center gap-3 relative z-10 uppercase tracking-widest">
            <div className="w-8 h-8 rounded-full border-2 border-red-100 flex items-center justify-center"><X className="w-4 h-4" /></div> SEBELUM GARASIKU
          </h4>
          <ul className="space-y-8 relative z-10 flex-1">
            {[
              "Parkir liar di trotoar & tarif 'tembak'",
              "Macet parah karena rebutan tempat",
              "Muter lama bikin capek & polusi",
              "Jalan kaki berkilo-kilometer ke venue",
              "Tarif tidak jelas & bisa berubah-ubah"
            ].map((text, idx) => (
              <li key={idx} className="flex gap-5 items-start text-slate-500 font-bold text-lg leading-tight group">
                <div className="mt-1 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-emerald-600 p-12 rounded-[4rem] text-white shadow-[0_50px_100px_-20px_rgba(5,150,105,0.3)] relative overflow-hidden flex flex-col h-full group"
        >
          <div className="absolute -right-10 -bottom-10 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
             <ShieldCheck className="w-72 h-72 text-white" />
          </div>
          <h4 className="text-2xl font-black text-emerald-100 mb-12 flex items-center gap-3 relative z-10 uppercase tracking-widest">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center"><Check className="w-4 h-4" /></div> SETELAH GARASIKU
          </h4>
          <ul className="space-y-8 relative z-10 flex-1">
            {[
              "Parkir terorganisir & aman",
              "Hidden gem parking dari warga lokal",
              "Harga transparan & fixed price",
              "Akses lebih dekat ke venue utama",
              "Area warga terpercaya & terverifikasi"
            ].map((text, idx) => (
              <li key={idx} className="flex gap-5 items-start text-white font-black tracking-tight text-xl leading-none group">
                <div className="mt-1 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-125 transition-transform">
                  <Check className="w-4 h-4 text-emerald-900" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeatureSpotlight = () => {
  const features = [
    {
      title: "Community Parking",
      desc: "Warga lokal membuka garasi dan halaman rumah mereka saat event besar berlangsung.",
      icon: Home,
      color: "bg-emerald-600"
    },
    {
      title: "AI Recommendation",
      desc: "AI membantu memilih parkir terbaik berdasarkan kepadatan dan akses jalan.",
      icon: Sparkles,
      color: "bg-blue-600"
    },
    {
      title: "Event Integrated",
      desc: "Lahan parkir otomatis muncul di peta hanya saat festival dan keramaian kota berlangsung.",
      icon: Calendar,
      color: "bg-indigo-600"
    },
    {
      title: "Extra Income",
      desc: "Pemilik rumah bisa mendapatkan penghasilan tambahan hingga Rp 5jt/bulan dari ruang kosong.",
      icon: TrendingUp,
      color: "bg-orange-600"
    },
    {
      title: "Hidden Gem Discovery",
      desc: "Temukan spot parkir tersembunyi yang tidak ada di aplikasi navigasi biasa.",
      icon: Search,
      color: "bg-violet-600"
    },
    {
      title: "Trusted & Safe",
      desc: "Setiap spot diverifikasi dengan pencahayaan baik, CCTV, dan ulasan komunitas.",
      icon: ShieldCheck,
      color: "bg-teal-600"
    }
  ];

  return (
    <section id="features" className="py-20 md:py-40 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16 md:mb-32">
          <span className="px-5 py-2.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-6 md:mb-8">Uniqueness & Innovation</span>
          <h2 className="text-4xl md:text-8xl font-[950] text-slate-950 tracking-tighter leading-none">Kenapa GarasiKu Berbeda?</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -15 }}
              className="p-12 rounded-[3.5rem] bg-slate-50/50 border-2 border-transparent hover:border-slate-100 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-500 group"
            >
              <div className={`w-20 h-20 ${f.color} rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-black/5 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-950 mb-5 tracking-tight leading-none">{f.title}</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventShowcase = ({ events }: { events: CityEvent[] }) => {
  const safeEvents = events || [];
  
  return (
  <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,#10B981_0%,transparent_50%)] opacity-20"></div>
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
         <div className="max-w-3xl">
            <span className="px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-10 inline-block text-emerald-400">Live Dynamic Events</span>
            <h2 className="text-5xl md:text-8xl font-[950] tracking-tighter leading-[0.9] text-white">Event Spotlights</h2>
            <p className="text-slate-400 font-medium text-xl mt-10 leading-relaxed">
              Jelajahi area parkir aktif yang dibuka secara eksklusif oleh warga lokal untuk acara-acara besar minggu ini di seluruh Indonesia.
            </p>
         </div>
         <Link to="/find">
            <Button variant="outline" className="h-20 px-12 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] border-white/10 hover:bg-white/10 text-white backdrop-blur-xl">Lihat Semua Lahan</Button>
         </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {safeEvents.slice(0, 3).map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white/5 backdrop-blur-2xl rounded-[4rem] overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all duration-700"
          >
            <div className="h-80 relative overflow-hidden">
              <ImageWithFallback 
                src={event.image} 
                alt={`Informasi Parkir GarasiKu untuk ${event.name} di area ${event.location}`} 
                className="group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-80" 
                fallbackSrc="https://via.placeholder.com/600x400/059669/FFFFFF?text=Event+GarasiKu"
              />
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                <div className="px-4 py-2 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                  <span className="font-black">{event.city}</span>
                </div>
                <div className="px-4 py-2 bg-slate-900 border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 backdrop-blur">
                   <Ticket className="w-4 h-4" /> Official Event
                </div>
              </div>
              <div className="absolute bottom-8 right-8">
                <div className="px-5 py-3 bg-white text-slate-950 rounded-3xl shadow-2xl font-black text-lg tracking-tight">
                   {event.date}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                <h3 className="text-3xl font-black text-white leading-tight tracking-tight">{event.name}</h3>
              </div>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tersedia</p>
                   <p className="text-2xl font-black text-white tracking-tighter">AI <span className="text-[10px] text-emerald-400 uppercase font-black ml-1">Optimization</span></p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Crowd Level</p>
                   <p className={`text-2xl font-black tracking-tighter ${event.expectedCrowd === 'High' ? 'text-orange-500' : 'text-emerald-500'}`}>{event.expectedCrowd}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-bold flex items-center gap-2">
                   <MapPin className="w-4 h-4" /> {event.location}
                </div>
                <Link to="/find">
                   <Button variant="primary" size="sm" className="h-12 rounded-2xl px-8 font-black uppercase tracking-[0.15em] text-[10px] shadow-xl shadow-emerald-500/20">Cari Slot Parkir</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

const TrustSafety = () => (
   <section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6">
         <div className="flex flex-wrap justify-center gap-6">
            {[
               { name: "Verified Citizen", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600" },
               { name: "CCTV Available", icon: Activity, color: "bg-blue-50 text-blue-600" },
               { name: "Penerangan Baik", icon: Sparkles, color: "bg-amber-50 text-amber-600" },
               { name: "Dijaga Pemilik Rumah", icon: Home, color: "bg-red-50 text-red-600" },
               { name: "Review Komunitas", icon: Users, color: "bg-indigo-50 text-indigo-600" }
            ].map((item, idx) => (
               <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-4 px-8 py-5 rounded-3xl border-2 border-transparent hover:border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 font-black uppercase tracking-widest text-[10px] ${item.color}`}
               >
                  <item.icon className="w-5 h-5" />
                  {item.name}
               </motion.div>
            ))}
         </div>
      </div>
   </section>
);

const PropertyOwners = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleMitraClick = () => {
    if (isLoggedIn) {
      navigate('/register-spot');
    } else {
      navigate('/login', { state: { redirectTo: '/register-spot', from: 'register' } });
    }
  };

  return (
    <section className="py-16 md:py-40 bg-[#FAF9F6] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[500px] bg-slate-100/50 -skew-y-3 pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="px-5 py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-8 md:mb-10 inline-block shadow-xl shadow-emerald-200">Owner Ecosystem</span>
            <h2 className="text-4xl md:text-8xl font-[950] tracking-tighter leading-[0.95] md:leading-[0.9] text-slate-950 mb-8 md:mb-10">
              Ubah Halaman Rumah Jadi Penghasilan.
            </h2>
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed mb-10 md:mb-16 max-w-2xl">
              Saat event besar berlangsung di kota Anda, ruang kosong di garasi atau halamanmu bisa membantu ribuan orang sekaligus menghasilkan pendapatan harian yang signifikan.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
               <div className="p-6 md:p-8 bg-white border-2 border-white rounded-[2.5rem] shadow-xl hover:-rotate-2 transition-transform">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Potensi 3 Mobil</p>
                  <h4 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter">Rp 240.000 <span className="text-sm font-medium opacity-40">/hari</span></h4>
                  <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Demand: Peak (Concert)</p>
               </div>
               <div className="p-6 md:p-8 bg-white border-2 border-white rounded-[2.5rem] shadow-xl hover:rotate-2 transition-transform">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Potensi 10 Motor</p>
                  <h4 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter">Rp 150.000 <span className="text-sm font-medium opacity-40">/hari</span></h4>
                  <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Demand: High (Festival)</p>
               </div>
            </div>

            <Button 
              onClick={handleMitraClick}
              size="lg" 
              icon={PlusCircle} 
              className="w-full sm:w-auto px-10 md:px-14 h-20 md:h-24 text-xl md:text-2xl font-black rounded-[2rem] md:rounded-[2.5rem] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Mulai Sewakan Lahan
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 bg-white p-12 md:p-16 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-4 border-white group overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                  <Home className="w-64 h-64 text-slate-900" />
               </div>
               <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
                     <Check className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-none mb-2">Simulasi Keuntungan</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI Earning Forecaster active</p>
                  </div>
               </div>
               
               <div className="space-y-10 relative z-10">
                  <div className="p-8 bg-slate-950 rounded-[3rem] text-white flex flex-col gap-8 shadow-2xl">
                     <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Estimate Total Hub Profit</p>
                        <Zap className="w-6 h-6 text-emerald-400 animate-pulse" />
                     </div>
                     <h4 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-emerald-400">Rp 4.2jt+ <span className="text-base font-bold text-white opacity-40">/month</span></h4>
                     <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-emerald-500 shadow-[0_0_15px_rgba(5,150,105,0.8)]"></div>
                     </div>
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Low Season</span>
                        <span className="text-emerald-400 font-black">High Season (Festivals)</span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-8 pl-4">
                     <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 relative">
                             <ImageWithFallback src={`https://i.pravatar.cc/100?u=partner${i}`} alt="Partner" />
                          </div>
                        ))}
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-950 tracking-tight leading-none mb-1">1,200+ Mitra Warga Terdaftar</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active across 12 cities in Indonesia</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleMitraClick = () => {
    if (isLoggedIn) {
      navigate('/register-spot');
    } else {
      navigate('/login', { state: { redirectTo: '/register-spot', from: 'register' } });
    }
  };

  return (
    <section className="py-20 md:py-40 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
         <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
         >
            <span className="px-6 py-2.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.5em] rounded-full mb-8 md:mb-10 inline-block">Impact & Community</span>
            <h2 className="text-4xl md:text-9xl font-[950] tracking-tighter leading-[0.95] md:leading-[0.9] text-slate-950 mb-8 md:mb-12">
              Bersama Warga, Parkir Event Jadi <span className="italic text-emerald-600 underline decoration-emerald-100 decoration-4 md:decoration-8 underline-offset-[10px] md:underline-offset-[20px]">Lebih Baik.</span>
            </h2>
            <p className="text-lg md:text-3xl text-slate-500 font-medium leading-relaxed mb-12 md:mb-20 max-w-3xl mx-auto">
              GarasiKu membantu pengunjung menemukan parkir lebih mudah sekaligus mendukung ekonomi lokal setiap akhir pekan.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 md:gap-6">
              <Link to="/find" className="w-full sm:w-auto h-20 md:h-28">
                 <Button size="lg" icon={MapPin} className="w-full h-full rounded-[2rem] md:rounded-[3rem] text-xl md:text-2xl font-black uppercase tracking-widest shadow-2xl shadow-emerald-200 group active:scale-95 transition-transform bg-slate-950 text-white hover:bg-emerald-600">
                    Cari Parkir <ArrowRight className="w-7 h-7 md:w-10 md:h-10 group-hover:translate-x-4 transition-transform text-white/50" />
                 </Button>
              </Link>
              <Button 
                onClick={handleMitraClick}
                variant="outline" 
                size="lg" 
                icon={PlusCircle} 
                className="w-full sm:w-auto h-20 md:h-28 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 text-xl md:text-2xl font-black uppercase tracking-widest bg-white hover:border-emerald-600 hover:text-emerald-600 shadow-2xl shadow-slate-100 active:scale-95 transition-transform"
              >
                Gabung Mitra
              </Button>
            </div>
         </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-32 bg-slate-950 text-white border-t border-white/5 relative overflow-hidden">
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
    <div className="container mx-auto px-8 relative z-10">
      <div className="grid md:grid-cols-4 gap-20 mb-24">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-10 group">
             <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-emerald-500/20 group-hover:rotate-12 transition-transform">G</div>
             <span className="text-3xl font-black tracking-tighter uppercase">Garasi<span className="text-emerald-500">Ku</span></span>
          </Link>
          <p className="text-slate-500 font-medium text-xl max-w-sm leading-relaxed">
            The World's First Community-Powered Event Parking Platform. Built to support urban mobility and local economies.
          </p>
        </div>
        
        <div>
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-10">Platform Hub</h4>
          <ul className="space-y-6 text-sm font-black uppercase tracking-widest text-slate-400">
            <li><Link to="/find" className="hover:text-emerald-400 transition-colors">Find Local Spots</Link></li>
            <li><Link to="/register-spot" className="hover:text-emerald-400 transition-colors">Host Experience</Link></li>
            <li><Link to="/owner-dashboard" className="hover:text-emerald-400 transition-colors">Owner Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Community Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-10">Legal & Support</h4>
          <ul className="space-y-6 text-sm font-black uppercase tracking-widest text-slate-400">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Safety Protocols</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Partner Policy</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Centre</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">
          &copy; 2026 GarasiKu Indonesia &bull; Urban Mobility Initiative
        </p>
        <div className="flex gap-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Medium</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CityEvent[]>([]);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
      return;
    }
    setEvents(eventService.getEvents());
    setLiveActivities(eventService.getLiveActivity());
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero liveActivities={liveActivities} />
      <HowItWorks />
      <ComparisonSection />
      <FeatureSpotlight />
      <TrustSafety />
      <EventShowcase events={events} />
      <PropertyOwners />
      <FinalCTA />
      <Footer />
    </div>
  );
}

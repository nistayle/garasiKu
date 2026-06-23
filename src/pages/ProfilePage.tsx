import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Settings, Heart, History, LogOut, ChevronRight, ShieldCheck, CreditCard, 
  HelpCircle, LayoutDashboard, Wallet, Star, Users, Briefcase, ArrowRight, 
  TrendingUp, MapPin, Clock, Home, Sparkles, Zap, Calendar, Bell, Shield, 
  Activity, Plus, Map, CheckCircle2, Lock, Smartphone, Globe, Share2
} from 'lucide-react';
import { AuthenticatedNavbar } from '../components/AuthenticatedNavbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { useNavigate, Link } from 'react-router-dom';
import { parkingService } from '../services/parkingService';
import { ParkingSpot } from '../types';
import { Button, ImageWithFallback } from '../components/UI';

const HubCard = ({ icon: Icon, label, color, onClick, badge }: any) => (
  <motion.button 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left flex flex-col gap-4 group relative overflow-hidden"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${color} bg-opacity-10 group-hover:scale-110 duration-500`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-sm font-black text-slate-900 leading-tight mb-1">{label}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akses Hub</p>
    </div>
    {badge && (
      <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
        {badge}
      </div>
    )}
    <div className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${color.replace('text-', 'bg-')}`}></div>
  </motion.button>
);

const ActivityItem = ({ title, time, type }: any) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
        type === 'parking' ? 'bg-emerald-50 text-emerald-600' : 
        type === 'event' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'
      }`}>
        {type === 'parking' ? <MapPin className="w-5 h-5" /> : 
         type === 'event' ? <Calendar className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
      </div>
      <div className="w-px h-full bg-slate-100 my-1 group-last:hidden"></div>
    </div>
    <div className="pb-8 group-last:pb-0">
      <p className="text-[13px] font-black text-slate-800 leading-snug mb-1">{title}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{time}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mySpots, setMySpots] = useState<ParkingSpot[]>([]);
  const [isOwnerActive, setIsOwnerActive] = useState(true);
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Lahan Anda mendapat pengunjung baru', time: '5 MENIT LALU', type: 'success', text: 'Vario 125 telah memarkirkan kendaraan di garasi Anda.', read: false },
    { id: 2, title: 'Peringatan Traffic GBK', time: '1 JAM LALU', type: 'warning', text: 'Konser Sheila On 7 segera dimulai. Area Senayan mulai padat.', read: false },
    { id: 3, title: 'Promo Parkir Terdekat', time: '3 JAM LALU', type: 'info', text: 'Diskon 20% untuk parkir di area Sudirman khusus member Gold.', read: true },
  ]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn') === 'true';
    if (!auth) {
      navigate('/');
      return;
    }
    setIsLoggedIn(true);
    setMySpots(parkingService.getSpots().slice(0, 1));
  }, [navigate]);

  const [isSharing, setIsSharing] = useState(false);

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Link disalin ke clipboard', type: 'info' });
    } catch (err) {
      setToast({ message: 'Gagal menyalin link', type: 'info' });
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    
    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: 'GarasiKu',
          text: 'Cek profil GarasiKu saya!',
          url: window.location.href
        });
      } catch (err: any) {
        // If it failed because one is already in progress or other errors, fallback to clipboard
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      copyToClipboard();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  if (!isLoggedIn) return null;

  const isOwner = mySpots.length > 0;

  const SubViewHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center gap-4 mb-4 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-10">
      <button 
        onClick={onBack}
        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
      >
        <ArrowRight className="w-5 h-5 rotate-180" />
      </button>
      <h2 className="text-2xl font-[1000] text-slate-950 tracking-tight">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32 md:pb-40 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <AuthenticatedNavbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {!activeSubView ? (
            <motion.div 
              key="main-hub"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-8 md:space-y-12"
            >
              {/* 1. PROFILE HEADER SECTION */}
              <section className="relative">
                 <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    
                    <div className="relative group shrink-0">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] md:rounded-[3.5rem] bg-emerald-100 overflow-hidden border-4 border-white shadow-2xl relative z-10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
                        <ImageWithFallback 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop" 
                          alt="Avatar" 
                          fallbackSrc="https://i.pravatar.cc/300?u=user123"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 p-2 md:p-3 bg-emerald-600 text-white rounded-xl md:rounded-2xl shadow-lg z-20 animate-bounce group-hover:animate-none group-hover:scale-110 transition-transform">
                         <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-lg md:rounded-xl shadow-md z-20 flex items-center gap-1.5 border border-slate-100">
                        <Star className="w-3 md:w-3.5 h-3 md:h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-[9px] md:text-[10px] font-black text-slate-800">4.9</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left relative z-10 min-w-0">
                       <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-4">
                          <h1 className="text-2xl md:text-3xl font-[1000] text-slate-950 tracking-tight leading-none truncate">Anisa Thanan</h1>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                             <span className="bg-emerald-50 text-emerald-700 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                Verified Host
                             </span>
                          </div>
                       </div>
                       
                       <p className="text-xs md:text-sm font-medium text-slate-500 mb-6 flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
                         <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Jakarta Selatan</span>
                         <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Sejak 2024</span>
                       </p>

                       <div className="flex items-center justify-center md:justify-start gap-3">
                          <button 
                            onClick={() => setActiveSubView('edit-profile')}
                            className="h-11 md:h-12 px-5 md:px-6 rounded-xl md:rounded-2xl bg-slate-900 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10 font-bold"
                          >
                             Edit Profil
                          </button>
                          <button 
                            onClick={handleShare}
                            className="w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all font-bold"
                            disabled={isSharing}
                          >
                             <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                       </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 lg:gap-8 md:px-6 lg:px-10 border-l border-slate-100 text-center">
                       <div onClick={() => navigate('/activity')} className="group cursor-pointer">
                          <p className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors">24</p>
                          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking</p>
                       </div>
                       <div onClick={() => setActiveSubView('favorites')} className="group cursor-pointer">
                          <p className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">12</p>
                          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Favorit</p>
                       </div>
                    </div>
                 </div>
              </section>

              {/* 2. GENERAL HUB QUICK STATS */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div onClick={() => setActiveSubView('payments')} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-200 transition-all">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">SaldoKu</p>
                     <div className="flex items-end justify-between">
                        <p className="text-xl font-black tracking-tight text-slate-900">Rp 450rb</p>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                           <Plus className="w-4 h-4" />
                        </div>
                     </div>
                  </div>
                  <div onClick={() => navigate('/activity')} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-200 transition-all">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Aktivitas</p>
                     <div className="flex items-end justify-between">
                        <p className="text-xl font-black tracking-tight text-slate-900">3 Minggu</p>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                           <Zap className="w-4 h-4" />
                        </div>
                     </div>
                  </div>
                 <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Trust Score</p>
                    <div className="flex items-end justify-between">
                       <p className="text-xl font-black tracking-tight text-emerald-600">920</p>
                       <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                       </div>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Loyalty</p>
                    <div className="flex items-end justify-between">
                       <p className="text-xl font-black tracking-tight text-orange-600">Gold</p>
                       <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                          <Star className="w-4 h-4" />
                       </div>
                    </div>
                 </div>
              </section>

              {/* 3. HUB MENU GRID */}
              <section>
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-6 mb-6">Discovery Hub</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <HubCard 
                      icon={Home} 
                      label="Lahan Saya" 
                      color="text-emerald-600" 
                      onClick={() => navigate('/owner-dashboard')}
                      badge="Mitra"
                    />
                    <HubCard 
                      icon={Heart} 
                      label="Favorit" 
                      color="text-rose-600" 
                      onClick={() => setActiveSubView('favorites')}
                    />
                    <HubCard 
                      icon={Activity} 
                      label="Aktivitas" 
                      color="text-indigo-600" 
                      onClick={() => navigate('/activity')}
                    />
                    <HubCard 
                      icon={Calendar} 
                      label="Event" 
                      color="text-orange-600" 
                      onClick={() => navigate('/events')}
                    />
                    <HubCard 
                      icon={Shield} 
                      label="Keamanan" 
                      color="text-blue-600" 
                      onClick={() => setActiveSubView('security')}
                    />
                    <HubCard 
                      icon={Bell} 
                      label="Notifikasi" 
                      color="text-yellow-600" 
                      onClick={() => setActiveSubView('notifications')}
                      badge={notifications.filter(n => !n.read).length > 0 ? `${notifications.filter(n => !n.read).length} Baru` : undefined}
                    />
                    <HubCard 
                      icon={CreditCard} 
                      label="Pembayaran" 
                      color="text-purple-600" 
                      onClick={() => setActiveSubView('payments')}
                    />
                    <HubCard 
                      icon={Settings} 
                      label="Pengaturan" 
                      color="text-slate-600" 
                      onClick={() => setActiveSubView('settings')}
                    />
                 </div>
              </section>

              {/* 4. SMART AI INSIGHT SECTION */}
              <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group border border-white/5 shadow-2xl shadow-emerald-900/20">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.08] group-hover:rotate-12 transition-transform duration-1000">
                    <Sparkles className="w-32 h-32" />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center backdrop-blur-md border border-emerald-500/10">
                          <Sparkles className="w-6 h-6 text-emerald-400" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black tracking-tight leading-none mb-1">AI Smart Insight</h4>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Analisis Personal Sedang Berjalan</p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl group/card hover:bg-white/10 transition-all cursor-pointer">
                          <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-4 group-hover/card:scale-110 transition-transform">
                             <TrendingUp className="w-4 h-4 text-emerald-400" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-slate-300">
                            "Lahan Anda memiliki potensi <span className="text-emerald-400 font-black">penghasilan 40% lebih tinggi</span> saat konser weekend ini di GBK."
                          </p>
                       </div>
                       <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl group/card hover:bg-white/10 transition-all cursor-pointer">
                          <div className="w-8 h-8 rounded-xl bg-orange-400/10 flex items-center justify-center mb-4 group-hover/card:scale-110 transition-transform">
                             <Map className="w-4 h-4 text-orange-400" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-slate-300">
                            "Traffic parkir di area <span className="text-orange-400 font-black">Jakarta Selatan diprediksi naik</span> mulai pukul 18:00 WIB."
                          </p>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveSubView('ai-insight')}
                      className="w-full mt-8 bg-white/10 text-white h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all border border-white/10 font-bold"
                    >
                       Lihat Laporan Prediksi Lengkap
                    </button>
                 </div>
              </section>

              {/* 5. OWNER/MITRA HUB */}
              {isOwner && (
                <section className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                         <h3 className="text-2xl font-[1000] text-slate-950 tracking-tight leading-none mb-1">Pusat Mitra Warga</h3>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Host Assets
                         </p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className={`w-2 h-2 rounded-full ${isOwnerActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-slate-300'}`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                               {isOwnerActive ? 'Lahan Terbuka' : 'Lahan Tutup'}
                            </span>
                            <button 
                               onClick={() => setIsOwnerActive(!isOwnerActive)}
                               className={`ml-2 w-10 h-5 rounded-full transition-all relative ${isOwnerActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isOwnerActive ? 'right-1' : 'left-1'}`}></div>
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Okupansi</p>
                         <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">85%</p>
                            <span className="text-[10px] font-bold text-emerald-600">+12%</span>
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Penghasilan</p>
                         <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">Rp 2.4jt</p>
                            <span className="text-[10px] font-bold text-slate-400">Total</span>
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Review</p>
                         <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">4.9</p>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-1" />
                         </div>
                      </div>
                   </div>

                   <div className="mt-10 space-y-4">
                      <div className="flex items-center justify-between p-2 pl-6 bg-slate-900 text-white rounded-[2.5rem]">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                               <LayoutDashboard className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                               <p className="text-[13px] font-black leading-none mb-1">Garasiku Senayan Utama</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Asset</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => navigate('/owner-dashboard')}
                           className="h-12 px-6 rounded-[2rem] bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all font-bold"
                         >
                           Kelola
                         </button>
                      </div>
                   </div>
                </section>
              )}

              {/* 7. ACTIVITY TIMELINE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <section>
                    <div className="flex items-center justify-between mb-8 px-6">
                       <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Aktivitas Terbaru</h3>
                       <button 
                         onClick={() => setToast({ message: 'Riwayat telah dikosongkan', type: 'success' })}
                         className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                       >
                         Hapus Semua
                       </button>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                       <div className="space-y-2">
                          <ActivityItem title="Anda parkir di Garasiku GBK Utama" time="2 JAM YANG LALU" type="parking" />
                          <ActivityItem title="Konser Sheila On 7 ditambahkan ke favorit" time="KEMARIN" type="event" />
                          <ActivityItem title="Pembayaran saldo Rp 100.000 sukses" time="2 HARI LALU" type="system" />
                          <ActivityItem title="Update profil: PIN Keamanan diperbarui" time="MINGGU LALU" type="system" />
                       </div>
                       <button onClick={() => navigate('/activity')} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors font-bold">Lihat Semua Aktivitas</button>
                    </div>
                 </section>

                 {/* 8. SETTINGS & ACCOUNT HUB */}
                 <section className="space-y-6">
                    <div>
                       <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-6 mb-6">Pusat Kendali Akun</h3>
                       <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                          <button onClick={() => setActiveSubView('security')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all border-b border-slate-50 group">
                             <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <Shield className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                   <p className="text-sm font-black text-slate-800 leading-none mb-1">Keamanan & Login</p>
                                   <p className="text-[10px] font-medium text-slate-400">Dua langkah verifikasi aktif</p>
                                </div>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => setActiveSubView('settings')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all border-b border-slate-50 group">
                             <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <Lock className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                   <p className="text-sm font-black text-slate-800 leading-none mb-1">Privasi Lokasi</p>
                                   <p className="text-[10px] font-medium text-slate-400">Hanya bagikan saat memesan</p>
                                </div>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => setActiveSubView('notifications')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all border-b border-slate-50 group">
                             <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                   <p className="text-sm font-black text-slate-800 leading-none mb-1">Notifikasi App</p>
                                   <p className="text-[10px] font-medium text-slate-400">Event push enabled</p>
                                </div>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => setActiveSubView('settings')} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all group">
                             <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <Globe className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                   <p className="text-sm font-black text-slate-800 leading-none mb-1">Bahasa / Language</p>
                                   <p className="text-[10px] font-medium text-slate-400">Bahasa Indonesia (ID)</p>
                                </div>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>

                    <div className="bg-red-50/50 p-6 rounded-[2.5rem] border border-red-100 flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                             <LogOut className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-red-700 leading-none mb-1">Keluar Sesi</p>
                             <p className="text-[10px] font-medium text-red-400">Logout dari perangkat ini</p>
                          </div>
                       </div>
                       <button 
                         onClick={handleLogout}
                         className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 font-bold"
                       >
                         Logout
                       </button>
                    </div>
                 </section>
              </div>

              <div className="text-center py-10 opacity-30">
                 <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4 grayscale">
                    <span className="text-lg font-black text-slate-400">G</span>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">GarasiKu v2.4.0</p>
                 <p className="text-[10px] font-medium text-slate-400 mt-1">Universal Smart Parking & Community Dashboard</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sub-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-4xl mx-auto min-h-[60vh]"
            >
              <AnimatePresence mode="wait">
                {activeSubView === 'favorites' && (
                  <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SubViewHeader title="Favorit Saya" onBack={() => setActiveSubView(null)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {parkingService.getSpots().slice(0, 3).map((spot) => (
                        <div key={spot.id} onClick={() => navigate('/find')} className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 cursor-pointer group hover:-translate-y-2 transition-all">
                           <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-6 relative">
                              <ImageWithFallback 
                                src={spot.images?.[0] || 'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800'} 
                                className="group-hover:scale-110 transition-transform duration-700" 
                                alt={spot.name} 
                              />
                              <div className="absolute top-4 right-4 w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center">
                                 <Heart className="w-5 h-5 fill-current" />
                              </div>
                           </div>
                           <h4 className="text-xl font-black text-slate-900 mb-2">{spot.name}</h4>
                           <p className="text-sm font-medium text-slate-500 mb-6">{spot.address}</p>
                           <button className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all font-bold">
                              Lihat Lahan
                           </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSubView === 'notifications' && (
                  <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-10 border-b border-slate-100 px-4">
                       <SubViewHeader title="Notifikasi Hub" onBack={() => setActiveSubView(null)} />
                       <button 
                         onClick={() => {
                           setNotifications([]);
                           setToast({ message: 'Semua notifikasi dihapus', type: 'success' });
                         }}
                         className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                       >
                         Bersihkan Semua
                       </button>
                    </div>
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden divide-y divide-slate-50">
                       {notifications.length > 0 ? notifications.map(notif => (
                         <div key={notif.id} className={`p-8 hover:bg-slate-50 transition-all ${notif.read ? 'opacity-60' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notif.time}</span>
                               </div>
                               <button 
                                 onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
                                 className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500"
                               >
                                 Hapus
                               </button>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">{notif.title}</h4>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">{notif.text}</p>
                         </div>
                       )) : (
                         <div className="p-20 text-center">
                            <Bell className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Tidak ada notifikasi</p>
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}

                {activeSubView === 'ai-insight' && (
                  <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SubViewHeader title="GarasiKu AI Insights" onBack={() => setActiveSubView(null)} />
                    <div className="space-y-6">
                       <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group border border-white/5 shadow-2xl">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                             <Sparkles className="w-40 h-40" />
                          </div>
                          <div className="relative z-10">
                             <h4 className="text-2xl font-black mb-4">Prediksi Okupansi Weekend</h4>
                             <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                                Berdasarkan data historis dan jadwal event, lahan Anda diprediksi akan penuh (100% occupancy) mulai Sabtu pukul 15:00 WIB.
                             </p>
                             <div className="flex items-center gap-4">
                                <div className="px-6 py-3 bg-emerald-500 rounded-2xl text-slate-950 text-xs font-black uppercase tracking-widest">
                                   Potensi Rp 250rb+
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                                <MapPin className="w-6 h-6" />
                             </div>
                             <h4 className="text-lg font-black text-slate-900 mb-2">Populer di Sekitar</h4>
                             <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                Pengguna sering mencari "GBK Hall E" dan parkir berjarak 5 menit jalan kaki.
                             </p>
                          </div>
                          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                             <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6" />
                             </div>
                             <h4 className="text-lg font-black text-slate-900 mb-2">Optimalisasi Harga</h4>
                             <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                Naikkan harga Rp 5.000 selama event berlangsung untuk profit maksimal.
                             </p>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeSubView === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SubViewHeader title="Keamanan & Privasi" onBack={() => setActiveSubView(null)} />
                    <div className="space-y-6">
                       <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                          <h4 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-6">Perlindungan Akun</h4>
                          <div className="space-y-8">
                             {[
                               { label: 'Ubah Kata Sandi', desc: 'Ganti password Anda secara berkala', icon: Lock },
                               { label: 'Verifikasi Email', desc: 'anisa.t@gmail.com (Verified)', icon: ShieldCheck, status: 'Active' },
                               { label: 'Aktivitas Login', desc: 'Kelola sesi perangkat aktif', icon: Smartphone },
                               { label: 'Hapus Akun', desc: 'Hapus data permanen dari sistem', icon: LogOut, danger: true },
                             ].map((item, idx) => (
                               <div key={idx} onClick={() => setToast({ message: 'Fitur keamanan aktif', type: 'success' })} className="flex items-center justify-between group cursor-pointer">
                                  <div className="flex items-center gap-5">
                                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${item.danger ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
                                        <item.icon className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <p className={`text-sm font-black leading-none mb-1 ${item.danger ? 'text-red-600' : 'text-slate-900'}`}>{item.label}</p>
                                        <p className="text-[10px] font-medium text-slate-400 capitalize">{item.desc}</p>
                                     </div>
                                  </div>
                                  {item.status ? (
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.status}</span>
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                  )}
                               </div>
                             ))}
                          </div>
                       </section>
                    </div>
                  </motion.div>
                )}

                {activeSubView === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SubViewHeader title="Pengaturan App" onBack={() => setActiveSubView(null)} />
                    <div className="space-y-6">
                       <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                          <h4 className="text-xl font-black text-slate-900 mb-10">Preferensi Antarmuka</h4>
                          <div className="space-y-8">
                             <div className="flex items-center justify-between">
                                <div>
                                   <p className="text-sm font-black text-slate-900 mb-1">Mode Gelap (Dark Mode)</p>
                                   <p className="text-[10px] font-medium text-slate-400">Gunakan tampilan gelap di malam hari</p>
                                </div>
                                <button onClick={() => setToast({ message: 'Mode gelap diaktifkan', type: 'info' })} className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-all">
                                   <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                                </button>
                             </div>
                             <div className="flex items-center justify-between">
                                <div>
                                   <p className="text-sm font-black text-slate-900 mb-1">Notifikasi Push</p>
                                   <p className="text-[10px] font-medium text-slate-400">Dapatkan update langsung ke perangkat</p>
                                </div>
                                <button onClick={() => setToast({ message: 'Notifikasi dinonaktifkan', type: 'info' })} className="w-14 h-8 bg-emerald-500 rounded-full relative p-1 transition-all">
                                   <div className="w-6 h-6 bg-white rounded-full translate-x-6 shadow-md"></div>
                                </button>
                             </div>
                             <div className="flex items-center justify-between">
                                <div>
                                   <p className="text-sm font-black text-slate-900 mb-1">Izin Lokasi</p>
                                   <p className="text-[10px] font-medium text-slate-400">Navigasi ke lahan parkir akurat</p>
                                </div>
                                <button onClick={() => setToast({ message: 'Izin lokasi dicabut', type: 'info' })} className="w-14 h-8 bg-emerald-500 rounded-full relative p-1 transition-all">
                                   <div className="w-6 h-6 bg-white rounded-full translate-x-6 shadow-md"></div>
                                </button>
                             </div>
                          </div>
                       </section>
                    </div>
                  </motion.div>
                )}

                {activeSubView === 'payments' && (
                  <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SubViewHeader title="Metode Pembayaran" onBack={() => setActiveSubView(null)} />
                    <div className="space-y-6">
                       <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-200">
                          <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.4em] mb-4">Total SaldoKu</p>
                          <h3 className="text-4xl font-black mb-8 tracking-tighter">Rp 450.000</h3>
                          <div className="flex gap-4">
                             <button onClick={() => setToast({ message: 'Sistem top-up segera hadir', type: 'info' })} className="flex-1 h-14 bg-white text-emerald-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all font-bold">Top Up Saldo</button>
                             <button onClick={() => navigate('/activity')} className="flex-1 h-14 bg-emerald-500/20 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/20 font-bold">Riwayat</button>
                          </div>
                       </div>
                       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                          <h4 className="text-lg font-black text-slate-900 mb-6">Kartu / Bank Terdaftar</h4>
                          <div className="space-y-4">
                             <div className="p-6 border border-slate-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 italic">VISA</div>
                                   <div>
                                      <p className="text-sm font-black text-slate-900 italic">**** **** **** 4251</p>
                                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Expired 08/25</p>
                                   </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300" />
                             </div>
                             <button onClick={() => setToast({ message: 'Fitur belum tersedia', type: 'info' })} className="w-full h-16 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 transition-all font-bold">
                                <Plus className="w-5 h-5" /> Tambah Metode Baru
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeSubView === 'edit-profile' && (
                  <motion.div key="edit-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SubViewHeader title="Edit Profil" onBack={() => setActiveSubView(null)} />
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                       <div className="flex flex-col items-center gap-4 border-b border-slate-50 pb-8">
                          <div className="relative group">
                            <div className="w-24 h-24 rounded-[2rem] bg-emerald-100 overflow-hidden border-4 border-white shadow-lg relative">
                               <ImageWithFallback 
                                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop" 
                                 alt="Avatar" 
                                 fallbackSrc="https://i.pravatar.cc/300?u=user123"
                               />
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-center">
                               <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">Ganti Foto Profil</p>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                             <input type="text" defaultValue="Anisa Thanan" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Bio / Slogan</label>
                             <textarea defaultValue="Verified Host at Jakarta Selatan" className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all resize-none" />
                          </div>
                          <button 
                            onClick={() => {
                              setToast({ message: 'Profil berhasil diperbarui', type: 'success' });
                              setActiveSubView(null);
                            }}
                            className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg font-bold"
                          >
                             Simpan Perubahan
                          </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <MobileBottomNav />

      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-40 flex items-center gap-3 border border-white/10 backdrop-blur-lg"
          >
            <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`}></div>
            <p className="text-[10px] font-black uppercase tracking-widest">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

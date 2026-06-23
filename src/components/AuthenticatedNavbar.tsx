import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Activity, 
  Users, 
  Heart, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  History, 
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './UI';

export const AuthenticatedNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Cari Parkir', path: '/find', icon: Search },
    { name: 'Event', path: '/events', icon: Calendar },
    { name: 'Aktivitas', path: '/activity', icon: Activity },
    { name: 'Mitra Saya', path: '/owner-dashboard', icon: Users },
    { name: 'Favorit', path: '/profile', icon: Heart },
  ];

  const notifications = [
    { id: 1, title: 'Event Populer', desc: 'Event dekatmu mulai ramai, amankan spot sekarang!', time: '2 menit lalu', type: 'event' },
    { id: 2, title: 'Booking Baru', desc: 'Lahan parkirmu mendapat pesanan baru untuk Konser JKT48.', time: '15 menit lalu', type: 'booking' },
    { id: 3, title: 'Spot Tersedia', desc: 'Parkir favoritmu di Malioboro sedang ada slot kosong.', time: '1 jam lalu', type: 'info' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 py-3 md:py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group relative z-[70] shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-lg md:text-xl font-[1000] shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform ring-2 ring-emerald-100">
            G
          </div>
          <span className="text-lg md:text-xl font-[1000] text-slate-950 tracking-tighter hidden sm:block">
            Garasi<span className="text-emerald-600">Ku</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = link.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'text-emerald-700' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="desktopNavActive"
                    className="absolute inset-0 bg-emerald-50 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right: Profile & Notifications */}
        <div className="flex items-center gap-3 relative z-[70]">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                isNotificationsOpen ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className={`absolute top-2 right-2 w-2 h-2 rounded-full border-2 ${isNotificationsOpen ? 'bg-white border-emerald-600' : 'bg-orange-500 border-white'}`}></span>
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-2 overflow-hidden z-[100]"
                >
                  <div className="px-5 py-4 border-b border-slate-50 mb-1 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notifikasi Baru</p>
                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 px-2 py-1 rounded-lg transition-all">Bersihkan</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 ${
                            notif.type === 'event' ? 'bg-indigo-50 text-indigo-600' : 
                            notif.type === 'booking' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            <Bell className="w-5 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-950 mb-0.5 leading-none">{notif.title}</p>
                            <p className="text-xs font-medium text-slate-500 leading-snug mb-2">{notif.desc}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{notif.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-12 text-center">
                        <Bell className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400">Tidak ada notifikasi</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className={`flex items-center gap-2 p-1.5 pl-4 rounded-2xl border transition-all ${
                isProfileOpen ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className={`text-xs font-black hidden lg:block ${isProfileOpen ? 'text-white' : 'text-slate-700'}`}>Akun Pengguna</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 overflow-hidden ring-2 ring-white">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                  alt="User Avatar" 
                  fallbackSrc="https://via.placeholder.com/100/059669/FFFFFF?text=AT"
                />
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-2 overflow-hidden z-[100]"
                >
                  <div className="px-5 py-5 border-b border-slate-50 mb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                    <p className="text-sm font-black text-slate-950 truncate">user@garasiku.com</p>
                  </div>
                  
                  <div className="space-y-1">
                    {[
                      { name: 'Profil Saya', icon: User, path: '/profile' },
                      { name: 'Lahan Saya', icon: LayoutDashboard, path: '/owner-dashboard' },
                      { name: 'Riwayat Parkir', icon: History, path: '/activity' },
                      { name: 'Favorit', icon: Heart, path: '/profile' },
                      { name: 'Pengaturan', icon: Settings, path: '/profile' },
                    ].map((item) => (
                      <Link 
                        key={item.name} 
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-emerald-600 transition-all border border-transparent group-hover:border-emerald-100">
                          <item.icon className="w-4 h-4" />
                        </div>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-slate-50">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center text-red-300 group-hover:text-red-500 transition-all">
                        <LogOut className="w-4 h-4" />
                      </div>
                      Keluar Sesi
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};


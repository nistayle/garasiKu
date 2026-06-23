import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Home, 
  Search, 
  Calendar, 
  Activity, 
  User 
} from 'lucide-react';

export const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Beranda', path: '/dashboard', icon: Home },
    { name: 'Cari', path: '/find', icon: Search },
    { name: 'Event', path: '/events', icon: Calendar },
    { name: 'Aktivitas', path: '/activity', icon: Activity },
    { name: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-5 left-5 right-5 z-[100] pointer-events-none">
      <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/50 rounded-[2.25rem] px-3 py-2 shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex items-center justify-between pointer-events-auto max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
            
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-0.5 transition-all relative flex-1 py-1 ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -top-1 w-6 h-1 bg-emerald-600 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <motion.div 
                whileTap={{ scale: 0.85 }}
                className={`p-2 rounded-2xl transition-all relative ${isActive ? 'bg-emerald-50/80 text-emerald-600' : 'hover:bg-slate-50'}`}
              >
                <item.icon className="w-[22px] h-[22px]" />
              </motion.div>
              <span className="text-[8px] font-black uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Settings, 
  Plus, 
  MoreHorizontal, 
  Calendar,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Car,
  Bike,
  Star,
  Home,
  Zap,
  ChevronRight,
  Trash2,
  Ticket,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, ImageWithFallback } from '../components/UI';
import { UPCOMING_EVENTS } from '../constants';
import { parkingService } from '../services/parkingService';
import { ParkingSpot, ParkingStatus, VehicleType, AvailabilityType } from '../types';

const EventModeCard = () => {
  const [isEventMode, setIsEventMode] = React.useState(false);

  return (
    <Card glass className={`p-6 md:p-8 transition-all duration-500 border-2 ${isEventMode ? 'border-emerald-500 shadow-2xl shadow-emerald-200' : 'border-white/60'}`}>
       <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${isEventMode ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                <Zap className={`w-6 h-6 md:w-7 md:h-7 ${isEventMode ? 'animate-pulse' : ''}`} />
             </div>
             <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Mode Event</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">Auto-pilot harga premium.</p>
             </div>
          </div>
          <button 
            onClick={() => setIsEventMode(!isEventMode)}
            className={`w-14 h-8 rounded-full transition-all relative ${isEventMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
          >
             <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${isEventMode ? 'left-7' : 'left-1'}`}></div>
          </button>
       </div>

       <div className="space-y-4">
          <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Event Mendatang Terdeteksi</p>
             {UPCOMING_EVENTS.slice(0, 2).map(event => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative">
                         <ImageWithFallback src={event.image} alt={event.name} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800 leading-none mb-1">{event.name}</p>
                         <p className="text-[10px] font-medium text-slate-500">Estimasi Kenaikan: <span className="text-emerald-600 font-bold">25%</span></p>
                      </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
             ))}
          </div>
          <button className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
            isEventMode ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-50 text-slate-400 cursor-not-allowed'
          }`}>
             Lihat Penyesuaian Harga Otomatis
          </button>
       </div>
    </Card>
  );
};

const OverviewStat = ({ label, value, trend, icon: Icon }: any) => (
  <Card glass className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-600 border border-white/60">
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/50 backdrop-blur-md px-2 py-1 rounded-full border border-emerald-200">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          {trend}%
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">{label}</p>
    <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
  </Card>
);

import { AuthenticatedNavbar } from '../components/AuthenticatedNavbar';
import { MobileBottomNav } from '../components/MobileBottomNav';

import { toast } from 'sonner';

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, name }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Lahan Parkir?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
              Apakah Anda yakin ingin menghapus <span className="text-slate-900 font-bold">{name}</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-sm"
              >
                Batal
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all text-sm shadow-lg shadow-red-600/20"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const UpdateSlotsModal = ({ isOpen, onConfirm, onCancel, spot }: { isOpen: boolean; onConfirm: (mobil: number, motor: number, status?: ParkingStatus) => void; onCancel: () => void; spot: ParkingSpot | null }) => {
  const [mobil, setMobil] = useState(0);
  const [motor, setMotor] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (spot) {
      setMobil(spot.capacity[VehicleType.MOBIL]);
      setMotor(spot.capacity[VehicleType.MOTOR]);
    }
  }, [spot]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate minor delay for realtime feel
    await new Promise(resolve => setTimeout(resolve, 600));
    onConfirm(mobil, motor);
    setIsSaving(false);
  };

  const markFull = () => {
    setMobil(0);
    setMotor(0);
  };

  const openAll = () => {
    // Default capacity if not set, or just high numbers
    setMobil(10);
    setMotor(20);
  };

  const closeTemporarily = () => {
    onConfirm(mobil, motor, ParkingStatus.CLOSED);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 relative">
              <Zap className="w-8 h-8" />
              {isSaving && (
                <div className="absolute inset-0 border-4 border-emerald-600/20 border-t-emerald-600 rounded-2xl animate-spin"></div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">Update Slot & Status</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
              Kelola ketersediaan lahan <span className="text-slate-900 font-bold">{spot?.name}</span> secara realtime.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 font-bold text-slate-700">
                  <Car className="w-5 h-5 text-emerald-600" />
                  <span>Mobil</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setMobil(Math.max(0, mobil - 1))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black hover:border-emerald-500 transition-colors shadow-sm">-</button>
                  <motion.span 
                    key={mobil}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-10 text-center font-black text-xl text-slate-900"
                  >
                    {mobil}
                  </motion.span>
                  <button onClick={() => setMobil(mobil + 1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black hover:border-emerald-500 transition-colors shadow-sm">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4 font-black text-slate-800">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                    <Bike className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span>Motor</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setMotor(Math.max(0, motor - 1))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black hover:border-emerald-500 transition-colors shadow-sm">-</button>
                  <motion.span 
                    key={motor}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-10 text-center font-black text-xl text-slate-900"
                  >
                    {motor}
                  </motion.span>
                  <button onClick={() => setMotor(motor + 1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black hover:border-emerald-500 transition-colors shadow-sm">+</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-8">
               <button onClick={markFull} className="py-2 px-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-red-100 hover:bg-red-100 transition-colors">Tandai Penuh</button>
               <button onClick={openAll} className="py-2 px-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-100 hover:bg-emerald-100 transition-colors">Buka Semua</button>
               <button onClick={() => { setMobil(spot?.capacity[VehicleType.MOBIL] || 0); setMotor(spot?.capacity[VehicleType.MOTOR] || 0); }} className="py-2 px-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-100 hover:bg-slate-100 transition-colors">Reset Slot</button>
               <button onClick={closeTemporarily} className="py-2 px-3 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-orange-100 hover:bg-orange-100 transition-colors">Tutup Sementara</button>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={onCancel}
                disabled={isSaving}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3.5 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isSaving ? 'Menyimpan...' : 'Update Realtime'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditingSlots, setIsEditingSlots] = useState<string | null>(null);
  const ownerId = 'current-user-123';

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Baru saja';
    const now = new Date();
    const past = new Date(dateStr);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    return past.toLocaleDateString('id-ID');
  };

  useEffect(() => {
    const loadSpots = () => {
      const data = parkingService.getSpotsByOwner(ownerId);
      setSpots(data);
    };
    loadSpots();
  }, [ownerId]);

  const toggleStatus = (id: string) => {
    const spot = spots.find(s => s.id === id);
    if (!spot) return;

    const newStatus = spot.status === ParkingStatus.AVAILABLE ? ParkingStatus.CLOSED : ParkingStatus.AVAILABLE;
    const updatedSpot = parkingService.saveSpot({ ...spot, status: newStatus });
    setSpots(spots.map(s => s.id === id ? updatedSpot : s));
    toast.success(newStatus === ParkingStatus.AVAILABLE ? 'Lahan kini dibuka' : 'Lahan kini ditutup');
  };

  const handleDelete = () => {
    if (!isDeleting) return;
    parkingService.deleteSpot(isDeleting);
    setSpots(parkingService.getSpotsByOwner(ownerId));
    setIsDeleting(null);
    toast.success('Lahan berhasil dihapus');
  };

  const handleUpdateSlots = (mobil: number, motor: number, status?: ParkingStatus) => {
    if (!isEditingSlots) return;
    const spot = spots.find(s => s.id === isEditingSlots);
    if (!spot) return;

    const updatedSpot = parkingService.saveSpot({
      ...spot,
      status: status || spot.status,
      capacity: {
        ...spot.capacity,
        [VehicleType.MOBIL]: mobil,
        [VehicleType.MOTOR]: motor,
      }
    });

    setSpots(spots.map(s => s.id === isEditingSlots ? updatedSpot : s));
    setIsEditingSlots(null);
    toast.success('Lahan parkir berhasil diperbarui');
  };

  const recentBookings = [
    { id: '1', user: 'Andi Santoso', vehicle: 'Mobil', time: 'Hari ini, 09:00', amount: 'Rp15.000', status: 'Selesai' },
    { id: '2', user: 'Lina Marlina', vehicle: 'Motor', time: 'Hari ini, 10:30', amount: 'Rp5.000', status: 'Berlangsung' },
    { id: '3', user: 'Rahmat Hidayat', vehicle: 'Mobil', time: 'Kemarin, 19:00', amount: 'Rp20.000', status: 'Selesai' },
  ];

  const totalIncome = spots.length > 0 ? spots.length * 150000 : 0; // Mock calculation
  const totalBookings = spots.length > 0 ? spots.length * 32 : 0; // Mock calculation

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-40 lg:pb-0">
      <AuthenticatedNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden lg:flex flex-col p-6 z-20">
          <nav className="flex-1 space-y-2 pt-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-bold border border-emerald-100 shadow-sm transition-all text-sm">
              <BarChart3 className="w-5 h-5" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold transition-all text-sm">
              <Calendar className="w-5 h-5" /> Jadwal
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold transition-all text-sm">
              <MapPin className="w-5 h-5" /> Spot Saya
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold transition-all text-sm">
              <Users className="w-5 h-5" /> Pelanggan
            </button>
            
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
              <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold transition-all text-sm">
                <Home className="w-5 h-5" /> Overview
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold transition-all text-sm">
                <Settings className="w-5 h-5" /> Pengaturan
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative flex flex-col pt-8 lg:pt-0">
          <div className="absolute inset-0 bg-slate-50 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:p-12 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors mb-2 w-fit">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ke Dashboard Utama</span>
                </Link>
                <h1 className="text-3xl md:text-5xl font-[950] text-slate-950 tracking-tighter">Mitra Management Hub 👋</h1>
                <p className="text-slate-500 text-sm md:text-base font-medium">Monitoring performa dan ketersediaan lahan parkir Anda.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="primary" icon={Plus} className="shadow-xl shadow-emerald-500/20 rounded-xl md:rounded-2xl px-6 md:px-8 h-12 md:h-14 font-black uppercase tracking-widest text-[11px] md:text-xs w-full md:w-auto" onClick={() => navigate('/register-spot')}>Tambah Lahan</Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            <OverviewStat label="Total Pendapatan" value={`Rp${totalIncome.toLocaleString()}`} trend={12} icon={Wallet} />
            <OverviewStat label="Total Booking" value={totalBookings} trend={8} icon={Users} />
            <OverviewStat label="Rating" value="4.8" icon={Star} />
            <OverviewStat label="Slot Terpakai" value="85%" trend={5} icon={CheckCircle2} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Active Spot */}
            <div className="lg:col-span-2 space-y-8">
              <EventModeCard />
              
              <Card glass className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Spot Aktif Anda</h3>
                  <button className="p-2 hover:bg-white/50 rounded-full text-slate-400">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {spots.length > 0 ? spots.map(spot => (
                    <div key={spot.id} className="flex flex-col md:flex-row gap-6 md:gap-8 items-center bg-white/40 p-5 md:p-6 rounded-[2rem] border border-white/60 backdrop-blur-sm">
                      <div className="w-full md:w-48 h-40 md:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white relative">
                        <ImageWithFallback 
                          src={spot.images[0]} 
                          alt={spot.name}
                          fallbackSrc="https://via.placeholder.com/600x400/059669/FFFFFF?text=GarasiKu+Spot"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between md:justify-start gap-3 mb-2">
                          <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${
                               spot.status === ParkingStatus.AVAILABLE ? 'bg-emerald-500 animate-pulse' : 
                               spot.status === ParkingStatus.ALMOST_FULL ? 'bg-orange-500 animate-pulse' : 
                               spot.status === ParkingStatus.FULL ? 'bg-red-500' :
                               spot.status === ParkingStatus.COMING_SOON ? 'bg-blue-500' : 'bg-slate-400'
                             }`}></span>
                             <span className={`font-black text-[9px] md:text-[10px] uppercase tracking-widest leading-none ${
                                 spot.status === ParkingStatus.AVAILABLE ? 'text-emerald-700' : 
                                 spot.status === ParkingStatus.ALMOST_FULL ? 'text-orange-700' : 
                                 spot.status === ParkingStatus.FULL ? 'text-red-700' : 
                                 spot.status === ParkingStatus.COMING_SOON ? 'text-blue-700' : 'text-slate-700'
                             }`}>
                               {spot.status}
                             </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300 hidden md:inline">|</span>
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 text-slate-300" /> {timeAgo(spot.updatedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-slate-900 mb-2">{spot.name}</h4>
                        
                        <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2 mb-4">
                          <div className="flex gap-4 text-[11px] md:text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                              <Car className="w-4 h-4 text-emerald-600" /> 
                              <motion.span 
                                key={spot.capacity[VehicleType.MOBIL]}
                                initial={{ scale: 1.5, color: '#10b981' }}
                                animate={{ scale: 1, color: '#64748b' }}
                                transition={{ duration: 0.3 }}
                              >
                                {spot.capacity[VehicleType.MOBIL]}
                              </motion.span>
                              Slot Mobil
                            </span>
                            <span className="flex items-center gap-1">
                              <Bike className="w-4 h-4 text-emerald-600" /> 
                              <motion.span 
                                key={spot.capacity[VehicleType.MOTOR]}
                                initial={{ scale: 1.5, color: '#10b981' }}
                                animate={{ scale: 1, color: '#64748b' }}
                                transition={{ duration: 0.3 }}
                              >
                                {spot.capacity[VehicleType.MOTOR]}
                              </motion.span>
                              Slot Motor
                            </span>
                          </div>
                          {spot.availabilityType === AvailabilityType.TEMPORARY && (
                            <div className="flex items-center gap-4 py-1 px-3 bg-slate-50 rounded-xl border border-slate-100">
                              {spot.relatedEventName && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600">
                                  <Ticket className="w-3.5 h-3.5" /> {spot.relatedEventName}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                <Clock className="w-3.5 h-3.5" /> {spot.operatingHours}
                              </span>
                              <span className="text-[10px] font-black text-slate-300 tracking-tighter">
                                {spot.startDate && spot.endDate ? `${new Date(spot.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${new Date(spot.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <button 
                          onClick={() => toggleStatus(spot.id)}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                            spot.status === ParkingStatus.AVAILABLE 
                            ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                          }`}
                        >
                          {spot.status === ParkingStatus.AVAILABLE ? 'Tutup Slot' : 'Buka Slot'}
                        </button>
                        <button 
                          onClick={() => setIsEditingSlots(spot.id)}
                          className="px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl font-bold text-emerald-700 text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                        >
                          <Zap className="w-3 h-3" /> Update Slot
                        </button>
                        <button 
                          onClick={() => setIsDeleting(spot.id)}
                          className="px-4 py-2.5 bg-white/60 border border-white/80 rounded-xl font-bold text-red-400 text-xs hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center bg-white/20 rounded-[3rem] border-2 border-dashed border-white/60 backdrop-blur-sm">
                      <div className="w-20 h-20 bg-slate-100/50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 border border-white">
                         <MapPin className="w-10 h-10" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Belum ada lahan parkir</h4>
                      <p className="text-slate-500 font-medium max-w-sm mb-8">Daftarkan lahan Anda sekarang dan mulai hasilkan cuan dari area kosong di properti Anda.</p>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate('/register-spot')}
                        className="shadow-xl shadow-emerald-500/20 rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]"
                        icon={Plus}
                      >
                        Tambah Lahan Baru
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <Card glass className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Analitik Pendapatan</h3>
                <div className="h-64 flex items-end gap-3 px-4">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 60, 85, 75, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 transition-all rounded-t-xl group relative" style={{ height: `${h}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl z-20 scale-90 group-hover:scale-100">
                        Rp{h}rb
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6 px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <span>Jan</span>
                  <span>Mei</span>
                  <span>Des</span>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="space-y-8">
              <Card glass className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Booking Terbaru</h3>
                <div className="space-y-6">
                  {recentBookings.map(bk => (
                    <div key={bk.id} className="flex items-start gap-4 pb-6 border-b border-white/40 last:border-0 last:pb-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/60 ${
                        bk.status === 'Berlangsung' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {bk.vehicle === 'Mobil' ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{bk.user}</p>
                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">{bk.time}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                           bk.status === 'Berlangsung' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {bk.status}
                        </span>
                      </div>
                      <div className="ml-auto font-bold text-sm text-emerald-700">{bk.amount}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors uppercase tracking-widest border-t border-white/20">
                  Lihat Semua Aktivitas
                </button>
              </Card>

              <Card className="p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/40 transition-colors"></div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                   <AlertCircle className="w-6 h-6 text-emerald-400" />
                   <h4 className="font-bold tracking-tight">Tips Cuan Akhir Pekan</h4>
                </div>
                <p className="text-sm text-slate-300 mb-8 leading-relaxed relative z-10 font-medium">
                  Permintaan parkir di Malioboro diprediksi naik <span className="text-emerald-400 font-bold">40%</span> hari ini. Pertimbangkan untuk membuka slot motor tambahan!
                </p>
                <Button variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white relative z-10">
                  Update Slot
                </Button>
              </Card>
            </div>
          </div>
          </div>
        </main>
      </div>
      <MobileBottomNav />
      
      <DeleteConfirmModal 
        isOpen={!!isDeleting}
        onCancel={() => setIsDeleting(null)}
        onConfirm={handleDelete}
        name={spots.find(s => s.id === isDeleting)?.name}
      />

      <UpdateSlotsModal
        isOpen={!!isEditingSlots}
        onCancel={() => setIsEditingSlots(null)}
        onConfirm={handleUpdateSlots}
        spot={spots.find(s => s.id === isEditingSlots) || null}
      />
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Car, 
  Bike, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Building,
  TreePine,
  Home,
  Calendar,
  Sparkles,
  Ticket
} from 'lucide-react';
import { Button, Card, ImageWithFallback } from '../components/UI';
import { parkingService } from '../services/parkingService';
import { VehicleType, ParkingStatus, AvailabilityType } from '../types';

const STEPS = [
  { id: 1, title: 'Registrasi Lahan', icon: Home },
  { id: 2, title: 'Verifikasi', icon: ShieldCheck },
  { id: 3, title: 'Dashboard', icon: CheckCircle2 }
];

import { AuthenticatedNavbar } from '../components/AuthenticatedNavbar';

export default function RegisterSpot() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'garage',
    capacityMotor: 0,
    capacityCar: 0,
    price: 5000,
    description: '',
    availabilityType: AvailabilityType.PERMANENT,
    startDate: '',
    endDate: '',
    operatingHours: '08:00 - 22:00',
    relatedEventName: '',
    images: [] as string[]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file as File);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name.includes('capacity')) ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const setType = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const [isRegistered, setIsRegistered] = useState(false);

  const handleNext = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;
    
    if (currentStep === 1) {
      if (!formData.name || !formData.address) {
        toast.error('Mohon isi nama garasi dan alamat lengkap');
        return;
      }
      setCurrentStep(2);
      // Simulate verification delay
      const timer = setTimeout(() => {
        setCurrentStep(prev => {
          if (prev === 2) {
             completeRegistration();
             return 3;
          }
          return prev;
        });
      }, 3000);
      return () => clearTimeout(timer);
    } else if (currentStep === 2) {
      completeRegistration();
      setCurrentStep(3);
    } else if (currentStep === 3) {
      navigate('/owner-dashboard');
    }
  };

  const completeRegistration = () => {
    if (isRegistered) return;
    setIsRegistered(true);
    setIsSubmitting(true);
    
    try {
      parkingService.saveSpot({
        name: formData.name,
        address: formData.address,
      description: formData.description || 'Lahan parkir aman dan strategis.',
      pricePerHour: formData.price,
      capacity: {
        [VehicleType.MOTOR]: formData.capacityMotor,
        [VehicleType.MOBIL]: formData.capacityCar
      },
      status: ParkingStatus.AVAILABLE,
      ownerName: 'Anisa Thanan', // Mock current user
      ownerId: 'current-user-123',
      availabilityType: formData.availabilityType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      operatingHours: formData.operatingHours,
      relatedEventName: formData.relatedEventName,
      rating: 0,
      reviewsCount: 0,
      coordinates: { lat: -7.7956, lng: 110.3695 }, // Mock coordinates nearby Titik Nol
      images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1590674852885-8c6424b33343?auto=format&fit=crop&q=80&w=800"],
      features: ['CCTV', 'Penjagaan 24 Jam'],
      safetyScore: 95,
      isVerified: false
      });
      toast.success('Pendaftaran Lahan Berhasil!');
    } catch (error) {
      toast.error('Gagal mendaftarkan lahan');
      setIsRegistered(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AuthenticatedNavbar />

      <main className="flex-1 flex flex-col items-center py-8 md:py-12 px-4 md:px-6 relative z-10">
        <div className="w-full max-w-2xl flex items-center justify-between mb-8">
           <Link to="/owner-dashboard" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">Batal</span>
           </Link>
           <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Step {currentStep} of 3</span>
        </div>

        <div className="w-full max-w-2xl mb-8 md:mb-12 relative flex justify-between">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div 
                  animate={{ 
                    scale: isCurrent ? 1.05 : 1,
                    backgroundColor: isActive ? '#059669' : '#fff',
                    color: isActive ? '#fff' : '#94a3b8'
                  }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg border-2 ${isActive ? 'border-emerald-600' : 'border-slate-200'}`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
                <p className={`mt-3 text-[9px] md:text-xs font-bold uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl"
            >
              <Card glass className="p-6 md:p-12">
                <div className="mb-8 md:mb-10">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Daftarkan Lahan Anda</h1>
                  <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                    Bantu kurangi kemacetan dan dapatkan penghasilan tambahan dengan menyewakan lahan idle Anda.
                  </p>
                </div>

                <form onSubmit={handleNext} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Jenis Ketersediaan Lahan</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, availabilityType: AvailabilityType.PERMANENT }))}
                            className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 text-center ${formData.availabilityType === AvailabilityType.PERMANENT ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xl shadow-emerald-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'}`}
                          >
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.availabilityType === AvailabilityType.PERMANENT ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>
                                <CheckCircle2 className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-xs font-black">Permanen</p>
                                <p className="text-[9px] opacity-70">Tersedia setiap hari</p>
                             </div>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, availabilityType: AvailabilityType.TEMPORARY }))}
                            className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 text-center ${formData.availabilityType === AvailabilityType.TEMPORARY ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xl shadow-blue-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}
                          >
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.availabilityType === AvailabilityType.TEMPORARY ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>
                                <Calendar className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-xs font-black">Sementara / Event</p>
                                <p className="text-[9px] opacity-70">Buka di periode tertentu</p>
                             </div>
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nama Area Parkir</label>
                       <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Contoh: Garasi Pak Budi"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tipe Lahan</label>
                       <div className="grid grid-cols-3 gap-2">
                          <button 
                            type="button" 
                            onClick={() => setType('garage')}
                            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.type === 'garage' ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border border-slate-200 text-slate-400 hover:border-emerald-200'}`}
                          >
                             <Home className="w-5 h-5" />
                             <span className="text-[10px] font-bold">Garasi</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setType('building')}
                            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.type === 'building' ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border border-slate-200 text-slate-400 hover:border-emerald-200'}`}
                          >
                             <Building className="w-5 h-5" />
                             <span className="text-[10px] font-bold">Halaman</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setType('land')}
                            className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.type === 'land' ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border border-slate-200 text-slate-400 hover:border-emerald-200'}`}
                          >
                             <TreePine className="w-5 h-5" />
                             <span className="text-[10px] font-bold">Lahan</span>
                          </button>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Lokasi Lengkap</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                       <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Jl. Raya Utama No. 123..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                       />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Kapasitas (Slot)</label>
                       <div className="flex gap-4">
                          <div className="flex-1 relative">
                             <Bike className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                             <input 
                              type="number" 
                              name="capacityMotor"
                              value={formData.capacityMotor}
                              onChange={handleInputChange}
                              placeholder="Motor" 
                              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                             />
                          </div>
                          <div className="flex-1 relative">
                             <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                             <input 
                              type="number" 
                              name="capacityCar"
                              value={formData.capacityCar}
                              onChange={handleInputChange}
                              placeholder="Mobil" 
                              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                             />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Harga Per Jam</label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                          <input 
                            type="number" 
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            placeholder="5000"
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                       </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.availabilityType === AvailabilityType.TEMPORARY && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50/50 p-6 rounded-[2.5rem] border border-blue-100 space-y-6 overflow-hidden"
                      >
                         <h3 className="text-sm font-black text-blue-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Pengaturan Event & Durasi
                         </h3>
                         
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-blue-400">Nama Event (Opsional)</label>
                               <div className="relative">
                                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                                  <input 
                                   type="text" 
                                   name="relatedEventName"
                                   value={formData.relatedEventName}
                                   onChange={handleInputChange}
                                   placeholder="Contoh: Konser NDX AKA"
                                   className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                                  />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-blue-400">Jam Operasional</label>
                               <div className="relative">
                                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                                  <input 
                                   type="text" 
                                   name="operatingHours"
                                   value={formData.operatingHours}
                                   onChange={handleInputChange}
                                   placeholder="Contoh: 15:00 - 23:00"
                                   className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                                  />
                               </div>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-blue-400">Tanggal Mulai</label>
                               <input 
                                type="date" 
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-blue-400">Tanggal Selesai</label>
                               <input 
                                type="date" 
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                               />
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Foto Lahan</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <label className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-white hover:border-emerald-500/50 transition-all cursor-pointer">
                          <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                             <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-500">Upload</p>
                       </label>

                       {formData.images.map((img, index) => (
                         <div key={index} className="relative group aspect-square rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                            <ImageWithFallback 
                              src={img} 
                              alt={`Preview ${index}`} 
                            />
                            <button 
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <span className="text-xs">×</span>
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Memproses...
                      </div>
                    ) : 'Lanjutkan Verifikasi'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl"
            >
              <Card glass className="p-12 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-[2.5rem] flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-xl shadow-blue-100/50">
                   <ShieldCheck className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Verifikasi Instan</h2>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                  Demi keamanan komunitas, AI kami akan memverifikasi data dan foto lahan Anda dalam beberapa detik.
                </p>

                <div className="space-y-4 mb-10">
                   <div className="flex items-center gap-4 p-4 bg-white/50 border border-white/60 rounded-2xl">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                         <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Validasi Koordinat GPS Berhasil</span>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-white/50 border border-white/60 rounded-2xl">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                         <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Analisis Foto AI Selesai</span>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse">
                      <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                      <span className="text-sm font-bold text-slate-400">Sinkronisasi Basis Data Community...</span>
                   </div>
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={isSubmitting}
                  className="w-full py-4"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Selesaikan Pendaftaran'}
                </Button>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl"
            >
              <Card glass className="p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-xl shadow-emerald-100/50">
                   <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Selamat Berjualan!</h2>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                  Lahan Anda telah terdaftar dan aktif. Pengendara sekarang bisa menemukan dan memesan garasi Anda.
                </p>

                <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white text-left relative overflow-hidden mb-10">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
                   <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Startup Tip</p>
                   <p className="text-xs md:text-sm leading-relaxed mb-6 font-medium">
                     "Coba berikan layanan tambahan seperti air minum gratis atau wifi untuk mendapatkan rating bintang 5 lebih cepat!"
                   </p>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 uppercase font-bold text-[10px] truncate">AI</div>
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-tight">Partner Recommendation</span>
                   </div>
                </div>

                <Button onClick={() => navigate('/owner-dashboard')} className="w-full py-4" icon={ChevronRight}>Buka Dashboard</Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Visuals */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}

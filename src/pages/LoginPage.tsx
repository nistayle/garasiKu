import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/UI';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const fromMitra = location.state?.from === 'register';
  const redirectTo = location.state?.redirectTo || '/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Simulate login delay for smooth transition
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggingIn(false);
      navigate(redirectTo);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
      {/* Background decoration - very subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/30 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all group z-10">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Beranda</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white rounded-[2rem] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
          {/* Logo & Header */}
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-black mb-8 shadow-lg shadow-emerald-100">
            G
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            {fromMitra ? 'Bergabung Sebagai Mitra' : 'Selamat Datang Kembali'}
          </h1>
          <p className="text-slate-400 font-medium mb-12 text-center text-base px-4">
            {fromMitra 
              ? 'Masuk untuk mulai membuka lahan parkir Anda.' 
              : 'Masuk ke akun GarasiKu Anda.'}
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Field with Floating Label */}
            <div className="relative">
              <input
                type="text"
                id="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="peer w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-semibold transition-all focus:bg-white focus:border-emerald-600/30 focus:shadow-[0_0_0_4px_rgba(5,150,105,0.05)] outline-none"
                required
                disabled={isLoggingIn}
              />
              <label
                htmlFor="email"
                className="absolute left-6 top-5 text-slate-400 font-medium text-base pointer-events-none transition-all duration-200 peer-focus:text-xs peer-focus:-translate-y-3 peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-3"
              >
                Email atau Nomor HP
              </label>
            </div>

            {/* Password Field with Floating Label */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="peer w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-semibold transition-all focus:bg-white focus:border-emerald-600/30 focus:shadow-[0_0_0_4px_rgba(5,150,105,0.05)] outline-none"
                required
                disabled={isLoggingIn}
              />
              <label
                htmlFor="password"
                className="absolute left-6 top-5 text-slate-400 font-medium text-base pointer-events-none transition-all duration-200 peer-focus:text-xs peer-focus:-translate-y-3 peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-3"
              >
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                disabled={isLoggingIn}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button type="button" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Lupa kata sandi?
              </button>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-50 mt-4 flex items-center justify-center gap-3" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk ke GarasiKu'
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Belum punya akun?{' '}
              <Link to="/register-spot" className="text-emerald-600 font-bold hover:underline">
                Daftar sebagai Mitra atau Pengguna
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest relative z-10">
        &copy; 2026 GarasiKu Indonesia &bull; Smart Urban Mobility
      </p>
    </div>
  );
};

export default LoginPage;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import LandingPage from './pages/LandingPage';
import FindParking from './pages/FindParking';
import DashboardHub from './pages/DashboardHub';
import OwnerDashboard from './pages/OwnerDashboard';
import RegisterSpot from './pages/RegisterSpot';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import ActivityPage from './pages/ActivityPage';
import ProfilePage from './pages/ProfilePage';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* @ts-expect-error key is not in RoutesProps but needed for AnimatePresence */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/find" element={<PageWrapper><FindParking /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
        <Route path="/activity" element={<PageWrapper><ActivityPage /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><DashboardHub /></PageWrapper>} />
        <Route path="/owner-dashboard" element={<PageWrapper><OwnerDashboard /></PageWrapper>} />
        <Route path="/register-spot" element={<PageWrapper><RegisterSpot /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

import { Toaster } from 'sonner';
import { APIProvider } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  if (!hasValidKey && window.location.pathname === '/find') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans p-6">
        <div className="text-center max-w-lg bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Google Maps API Key Diperlukan</h2>
          <p className="text-slate-600 mb-8">Untuk mengaktifkan pencarian parkir cerdas dan integrasi Places API, harap tambahkan API Key Anda.</p>
          
          <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Langkah-langkah:</p>
            <ol className="text-sm text-slate-600 space-y-3 list-decimal pl-4">
              <li>Dapatkan API Key di <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener" className="text-emerald-600 font-bold hover:underline">Google Cloud Console</a>.</li>
              <li>Buka <strong>Settings</strong> (ikon ⚙️ di pojok kanan atas).</li>
              <li>Pilih <strong>Secrets</strong>.</li>
              <li>Tambah <code>GOOGLE_MAPS_PLATFORM_KEY</code> sebagai nama secret.</li>
              <li>Tempelkan API Key Anda dan tekan <strong>Enter</strong>.</li>
            </ol>
          </div>
          <p className="text-xs text-slate-400 mt-6 italic">Aplikasi akan memuat ulang secara otomatis setelah secret ditambahkan.</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <Router>
        <Toaster position="top-center" richColors />
        <AnimatedRoutes />
      </Router>
    </APIProvider>
  );
}

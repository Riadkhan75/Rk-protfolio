/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import CinematicIntro from './components/CinematicIntro';
import DynamicBackground from './components/DynamicBackground';
import SmoothScroll from './components/SmoothScroll';
import Navbar from './components/Navbar';
import AlertBanner from './components/AlertBanner';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Blog from './components/Blog';
import Contact from './components/Contact';
import SocialLinks from './components/SocialLinks';
import Login from './components/Admin/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AITerminal from './components/AITerminal';
import Challenges from './components/Challenges';
import Vault from './components/Vault';
import { SettingsProvider, LanguageProvider, useSettings, useLanguage } from './context/AppContext';
import { trackVisit } from './lib/analyticsService';
import { Terminal, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { SoundProvider, useSound } from './context/SoundContext';
import { cn } from './lib/utils';

function MaintenanceMode() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-12 border-2 border-red-500/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
        <ShieldAlert size={64} className="text-red-500 mb-6 mx-auto animate-bounce" />
        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-4">SYSTEM_OFFLINE</h1>
        <div className="w-20 h-1 bg-red-500 mx-auto mb-8" />
        <p className="text-white/60 font-mono text-sm max-w-md mx-auto leading-relaxed uppercase tracking-widest">
          The grid is currently undergoing localized maintenance. Neural links will be restored shortly.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] font-mono text-red-500/50">
          <Terminal size={12} />
          <span>STATUS: RECONSTRUCTING_NODES...</span>
        </div>
      </motion.div>
    </div>
  );
}

function Footer() {
  const { maintenanceMode, siteTitle, footerText } = useSettings();
  return (
    <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-neon rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-white/40 tracking-[0.4em] uppercase">{footerText}</span>
          </div>
          <p className="text-[8px] text-white/20 font-mono tracking-widest uppercase">Encryption_Type: AES-256-GCM | Status: Secure</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-white/20 hover:text-primary-neon transition-colors"><Terminal size={14} /></a>
          <a href="#" className="text-white/20 hover:text-[#ff00ff] transition-colors"><ShieldAlert size={14} /></a>
        </div>
      </div>
    </footer>
  );
}

function RootLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const { neonMode, maintenanceMode, primaryColor, fontStyle } = useSettings();
  const { isMuted, toggleMute } = useSound();

  const location = useLocation();

  useEffect(() => {
    trackVisit();

    const handleOpenVault = () => setIsVaultOpen(true);
    window.addEventListener('TRIGGER_VAULT', handleOpenVault);
    return () => window.removeEventListener('TRIGGER_VAULT', handleOpenVault);
  }, []);

  useEffect(() => {
    if (location.pathname === '/vault') {
      setIsVaultOpen(true);
      // Optional: you might want to redirect back to where they were
      // but for now just opening is enough as it's a modal overlay
    }
  }, [location.pathname]);

  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
    if (fontStyle) {
      document.documentElement.style.setProperty('--font-family', `"${fontStyle}", sans-serif`);
    }
  }, [primaryColor, fontStyle]);

  const handleIntroComplete = () => {
    setIsLoading(false);
    if (isMuted) {
      setTimeout(() => {
        toggleMute();
      }, 500);
    }
  };

  const isExcludeMaintenance = window.location.pathname.startsWith('/adminriad') || window.location.pathname.startsWith('/loginriad');

  if (maintenanceMode && !isExcludeMaintenance) {
    return <MaintenanceMode />;
  }

  return (
    <main className={`relative min-h-screen selection:bg-cyan-500 selection:text-black transition-colors duration-500 ${neonMode ? 'neon-theme' : ''}`}>
      <AnimatePresence>
        {isLoading && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <SmoothScroll>
          <div className="relative">
            <DynamicBackground />
            {!isExcludeMaintenance && <Navbar />}
            {!isExcludeMaintenance && <AlertBanner />}
            
            <div className="fixed bottom-8 left-8 z-[70] flex items-center gap-3">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className={cn(
                  "w-12 h-12 rounded-full border border-primary-neon/30 bg-black/40 backdrop-blur-md flex items-center justify-center text-primary-neon shadow-[0_0_15px_rgba(var(--primary-color-rgb,0,243,255),0.2)] group overflow-hidden transition-all",
                  isMuted && "animate-pulse border-white/20 text-white/40"
                )}
              >
                <div className="absolute inset-0 bg-primary-neon/5 group-hover:bg-primary-neon/20 transition-colors" />
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
                {!isMuted && (
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 border border-primary-neon rounded-full"
                  />
                )}
              </motion.button>

              {!isMuted && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-black/60 backdrop-blur-md border border-primary-neon/20 px-4 py-2 rounded-sm clip-path-polygon"
                >
                  <p className="text-[8px] text-primary-neon font-black tracking-widest uppercase mb-1">SIGNAL_CONNECTED</p>
                  <p className="text-[10px] text-white font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-neon rounded-full animate-pulse" />
                    Now_Playing: Ambient_Neural_Stream
                  </p>
                </motion.div>
              )}
            </div>
            
            <div className={cn("relative z-10 min-h-[calc(100vh-200px)]", !isExcludeMaintenance && "pt-24")}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={window.location.pathname}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>

            <AITerminal />

            <Vault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />

            <Footer />

            <div 
              className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999]"
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
              }}
            />
          </div>
        </SmoothScroll>
      )}
    </main>
  );
}

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-24">
      {children}
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <SoundProvider>
          <BrowserRouter>
            <ScrollToTop />
            <RootLayout>
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
                <Route path="/skills" element={<PageWrapper><Skills /></PageWrapper>} />
                <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
                <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                <Route path="/socials" element={<PageWrapper><SocialLinks /></PageWrapper>} />
                <Route path="/challenges" element={<PageWrapper><Challenges /></PageWrapper>} />
                <Route path="/loginriad" element={<Login />} />
                <Route path="/adminriad/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </RootLayout>
          </BrowserRouter>
        </SoundProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}

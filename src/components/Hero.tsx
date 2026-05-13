import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'motion/react';
import { ChevronDown, Download, Terminal, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeModal from './ResumeModal';
import Magnetic from './Magnetic';

import { useLanguage, useSettings } from '../context/AppContext';
// import { subscribeToSettings } from '../lib/firebase';

export default function Hero() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { profileImage, cvUrl, isDesktopMode, setIsDesktopMode } = useSettings();
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const handleCvAction = () => {
    if (cvUrl) {
      // Create a hidden link and trigger download
      const link = document.createElement('a');
      link.href = cvUrl;
      link.setAttribute('download', 'Resume_Neon_Hacker.pdf'); // Attempt to force download
      link.target = '_blank'; // Fallback to opening if download isn't supported by browser for cross-origin
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setIsResumeOpen(true);
    }
  };

  const finalProfileImage = (profileImage && profileImage.trim() !== '') ? profileImage : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80";

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-between pt-20 px-6 sm:px-20 max-w-[1400px] mx-auto z-10">
        {/* Left Decoration */}
        <div className="hidden lg:flex flex-col gap-6 items-center">
          <div className="w-[1px] h-32 bg-gradient-to-b from-primary-neon to-transparent mb-4" />
          <div className="rotate-180 [writing-mode:vertical-lr] text-[10px] tracking-[0.5em] text-white/50 hover:text-primary-neon cursor-pointer uppercase transition-colors">GITHUB</div>
          <div className="rotate-180 [writing-mode:vertical-lr] text-[10px] tracking-[0.5em] text-white/50 hover:text-[#ff00ff] cursor-pointer uppercase transition-colors">LINKEDIN</div>
          <div className="rotate-180 [writing-mode:vertical-lr] text-[10px] tracking-[0.5em] text-white/50 hover:text-white cursor-pointer uppercase transition-colors">TWITTER</div>
        </div>

        {/* Hero Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 flex flex-col items-center text-center px-4"
        >
          {/* Profile Image Circle */}
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="relative mb-8 group"
          >
            <div className="absolute inset-0 bg-primary-neon rounded-full blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-primary-neon overflow-hidden relative z-10 p-1 bg-black">
               <div className="w-full h-full rounded-full overflow-hidden border border-white/10">
                  <img 
                    src={finalProfileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 hover:scale-100" 
                  />
               </div>
            </div>
            {/* HUD decoration for photo */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary-neon" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#ff00ff]" />
          </motion.div>

          <span className="text-primary-neon text-xs tracking-[0.8em] font-black uppercase mb-4 opacity-70 animate-pulse">
            {t('hero_access')}
          </span>
          
          <div className="relative mb-6">
            <h1 
              className="text-4xl xs:text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter leading-none relative group glitch-effect"
              data-text={t('hero_title')}
            >
              {t('hero_title')}
            </h1>
          </div>

          <div className="text-xs sm:text-base md:text-xl font-mono text-white/80 mt-2 tracking-widest bg-white/5 px-4 sm:px-6 py-2 border-x border-primary-neon h-10 sm:h-12 flex items-center justify-center min-w-[240px] sm:min-w-[300px]">
            <Typewriter
              words={lang === 'EN' ? ['Full Stack Developer', 'UI Architect', 'Cyber Enthusiast', 'Digital Saboteur'] : ['ফুল স্ট্যাক ডেভেলপার', 'ইউআই আর্কিটেক্ট', 'সাইবার এনথুসিয়াস্ট', 'ডিজিটাল সাবোটিউর']}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-12 w-full max-w-3xl">
            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="skew-button btn-cyan btn-shimmer flex-1 min-w-[180px]"
                onClick={() => navigate('/projects')}
              >
                <span className="skew-button-label flex items-center justify-center gap-3">
                  <Terminal size={18} className="text-black/50" />
                  {t('hero_portfolio')}
                </span>
              </motion.button>
            </Magnetic>

            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="skew-button btn-pink flex-1 min-w-[180px]"
                onClick={() => navigate('/contact')}
              >
                <span className="skew-button-label flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-[#ff00ff] rounded-full animate-pulse" />
                  {t('hero_hire')}
                </span>
              </motion.button>
            </Magnetic>

            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCvAction}
                className="skew-button btn-outline flex-1 min-w-[180px]"
              >
                <span className="skew-button-label flex items-center justify-center gap-3">
                  <Download size={16} className="text-white/40 group-hover:animate-bounce" />
                  {t('hero_cv')}
                </span>
              </motion.button>
            </Magnetic>

            <Magnetic>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDesktopMode(!isDesktopMode)}
                className={`skew-button flex-1 min-w-[200px] transition-all border-2 ${isDesktopMode ? 'border-primary-neon text-primary-neon bg-primary-neon/10' : 'border-white/10 text-white/50 hover:border-primary-neon/50'}`}
              >
                <span className="skew-button-label flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px]">
                  <Monitor size={16} className={isDesktopMode ? 'animate-pulse' : ''} />
                  {isDesktopMode ? 'Desktop_Mode: ON' : 'Please Desktop mode on'}
                </span>
              </motion.button>
            </Magnetic>
          </div>
        </motion.div>

        {/* Right Stats / HUD Data */}
        <div className="hidden lg:block w-64 space-y-8">
          <div className="bg-white/5 backdrop-blur-md p-4 border-l-4 border-primary-neon">
            <div className="flex justify-between text-[10px] mb-2 font-mono">
              <span className="text-primary-neon">COGNITIVE_SYNC</span>
              <span className="text-white">98%</span>
            </div>
            <div className="h-1 bg-white/10 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "98%" }}
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full bg-primary-neon shadow-[0_0_10px_#0088ff]" 
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 border-l-4 border-[#ff00ff]">
            <div className="flex justify-between text-[10px] mb-2 font-mono">
              <span className="text-[#ff00ff]">UPTIME</span>
              <span className="text-white">8,760 HRS</span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-2 bg-[#ff00ff]" />
              ))}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 bg-white/20" />
              ))}
            </div>
          </div>

          <div className="text-[9px] font-mono text-white/40 leading-relaxed space-y-1">
            <p className="animate-pulse">{">"} LOADING MODULES... [OK]</p>
            <p>{">"} BYPASSING FIREWALL... [OK]</p>
            <p>{">"} DECRYPTING PORTFOLIO... [OK]</p>
            <p className="text-primary-neon font-bold">{">"} CONNECTION SECURE.</p>
          </div>

          {/* Live System Scan Window */}
          <div className="mt-8 bg-black/80 border border-primary-neon/20 p-4 font-mono text-[9px] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-neon animate-pulse">SYSTEM_SCANNING...</span>
              <span className="text-white/40">v4.0.2</span>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="text-white/20">TARGET:</span>
                <span className="text-white">AIS_NODE_PRIMARY</span>
              </div>
              <div className="flex gap-2">
                <span className="text-white/20">IP:</span>
                <span className="text-primary-neon">192.168.1.104</span>
              </div>
              <div className="flex gap-2">
                <span className="text-white/20">THREADS:</span>
                <span className="text-white">64_ACTIVE</span>
              </div>
            </div>
            {/* Moving Scanner Bar */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[2px] bg-primary-neon/30 blur-[1px] pointer-events-none"
            />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group cursor-pointer z-20"
          onClick={() => navigate('/about')}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary-neon to-transparent" />
          <span className="text-[10px] tracking-[0.4em] text-primary-neon group-hover:translate-y-1 transition-transform uppercase">DESCEND_INTO_SYSTEM</span>
        </motion.div>
      </section>

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}

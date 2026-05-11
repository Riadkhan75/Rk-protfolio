import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Zap, Globe, Cpu, Menu, X, Activity, Volume2, VolumeX, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage, useSettings } from '../context/AppContext';
import { useSound } from '../context/SoundContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLanguage();
  const { 
    siteTitle, 
    matrixEnabled, setMatrixEnabled, 
    neonMode, setNeonMode, 
    isMenuOpen, setIsMenuOpen,
    currentlyCoding 
  } = useSettings();
  const { isMuted, toggleMute, playHover, playClick, isYoutube } = useSound();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const location = useLocation();
  const { navLinks, secondaryLinks, audioOnText, audioOffText } = useSettings();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 sm:px-12 py-3 flex justify-between items-center border-b font-mono",
        scrolled ? "bg-black/90 backdrop-blur-md border-[#00f3ff]/20" : "bg-black/40 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 bg-[#00f3ff] animate-pulse rounded-full shadow-[0_0_8px_#00f3ff]" />
        <span className="text-[10px] tracking-[0.3em] font-bold text-[#00f3ff] hidden xs:block">SYSTEM: ONLINE</span>
        <span className="text-[10px] tracking-[0.3em] font-bold text-[#ff00ff]/70 px-4 border-l border-white/20 hidden lg:block uppercase">{siteTitle}</span>
      </div>

      <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[10px] tracking-[0.2em]">
        {navLinks.map((link) => {
          const isVaultLink = link.href === '/vault' || link.name.toUpperCase().includes('VAULT');
          return link.isExternal ? (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={(e) => {
                if (isVaultLink) {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('TRIGGER_VAULT'));
                }
                playClick();
              }}
              className="text-white/70 hover:text-[#00f3ff] transition-all tracking-[0.2em] relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00f3ff] transition-all group-hover:w-full" />
            </a>
          ) : (
            <Link
              key={link.name}
              to={isVaultLink ? '#' : link.href}
              onMouseEnter={playHover}
              onClick={(e) => {
                if (isVaultLink) {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('TRIGGER_VAULT'));
                }
                playClick();
              }}
              className={cn(
                "transition-all tracking-[0.2em] relative group",
                location.pathname === link.href ? "text-[#00f3ff]" : "text-white/70 hover:text-[#00f3ff]"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-[1px] bg-[#00f3ff] transition-all",
                location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <button 
             onClick={() => { playClick(); setLang(lang === 'EN' ? 'BN' : 'EN'); }}
             onMouseEnter={playHover}
             className="p-2 border border-white/10 hover:border-[#00f3ff] transition-all rounded-sm flex items-center gap-2 group"
             title="Switch Language"
          >
             <Globe size={14} className="group-hover:text-[#00f3ff]" />
             <span className="text-[10px] font-bold">{lang}</span>
          </button>

          <button 
             onClick={() => { playClick(); setMatrixEnabled(!matrixEnabled); }}
             onMouseEnter={playHover}
             className={cn(
               "p-2 border border-white/10 transition-all rounded-sm",
               matrixEnabled ? "text-[#00f3ff] border-[#00f3ff]/30 shadow-[0_0_10px_rgba(0,243,255,0.2)]" : "text-white/20"
             )}
             title="Toggle Matrix Effect"
          >
             <Cpu size={14} />
          </button>

          <button 
             onClick={() => { playClick(); setNeonMode(!neonMode); }}
             onMouseEnter={playHover}
             className={cn(
               "p-2 border border-white/10 transition-all rounded-sm",
               neonMode ? "text-[#ff00ff] border-[#ff00ff]/30 shadow-[0_0_10px_rgba(255,0,255,0.2)]" : "text-white/20"
             )}
             title="Toggle High-Contrast Neon"
          >
             <Zap size={14} />
          </button>

          <button 
             onClick={() => { toggleMute(); playClick(); }}
             onMouseEnter={playHover}
             className={cn(
               "p-2 border border-white/10 transition-all rounded-sm flex items-center gap-2 group",
               !isMuted ? "text-primary-neon border-primary-neon/30 bg-primary-neon/5" : "text-white/20"
             )}
             title={isMuted ? "Unmute Ambient" : "Mute Ambient"}
          >
             <div className="relative">
               {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
               {!isMuted && (
                 <motion.div 
                   animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="absolute inset-0 border border-primary-neon rounded-full"
                 />
               )}
             </div>
             {!isMuted ? (
               <div className="flex gap-0.5 items-end h-3">
                 <div className="w-0.5 h-full bg-primary-neon animate-[music-bar_0.8s_ease-in-out_infinite]" />
                 <div className="w-0.5 h-[60%] bg-primary-neon animate-[music-bar_1.2s_ease-in-out_infinite]" />
                 <div className="w-0.5 h-[80%] bg-primary-neon animate-[music-bar_1s_ease-in-out_infinite]" />
               </div>
             ) : (
               <span className="text-[7px] font-black tracking-widest opacity-40">{audioOffText || 'AI_OFF'}</span>
             )}
             {!isMuted && <span className="text-[7px] font-black tracking-widest text-primary-neon animate-pulse hidden lg:block">{audioOnText || 'AI_ON'}</span>}
          </button>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-white/70 hover:text-[#00f3ff]"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="h-4 w-px bg-white/10 mx-2 hidden lg:block" />
        
        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#00f3ff] transition-colors hidden sm:block"><Github size={16} /></a>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-[#00f3ff]/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 max-w-7xl mx-auto">
              <div className="text-[10px] text-white/20 font-mono tracking-widest pb-2 border-b border-white/5 uppercase">Primary_Menu</div>
              {navLinks.map((link) => {
                const isVaultLink = link.href === '/vault' || link.name.toUpperCase().includes('VAULT');
                return link.isExternal ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isVaultLink) {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('TRIGGER_VAULT'));
                      }
                      setIsMenuOpen(false);
                    }}
                    className="text-xs font-bold tracking-[0.3em] text-white/60 hover:text-[#00f3ff] p-2 border-b border-white/5"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={isVaultLink ? '#' : link.href}
                    onClick={(e) => {
                      if (isVaultLink) {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('TRIGGER_VAULT'));
                      }
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "text-xs font-bold tracking-[0.3em] p-2 border-b border-white/5",
                      location.pathname === link.href ? "text-[#00f3ff]" : "text-white/60 hover:text-[#00f3ff]"
                    )}
                  >
                    {link.name}
                  </Link>
                )
              })}

              {secondaryLinks && secondaryLinks.length > 0 && (
                <>
                  <div className="text-[10px] text-[#ff00ff]/30 font-mono tracking-widest pt-6 pb-2 border-b border-white/5 uppercase">Extra_Menu_Protocols</div>
                  {secondaryLinks.map((link) => {
                    const isVaultLink = link.href === '/vault' || link.name.toUpperCase().includes('VAULT');
                    return link.isExternal ? (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (isVaultLink) {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('TRIGGER_VAULT'));
                          }
                          setIsMenuOpen(false);
                        }}
                        className="text-xs font-bold tracking-[0.3em] text-white/60 hover:text-[#ff00ff] p-2 border-b border-[#ff00ff]/5"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        key={link.name}
                        to={isVaultLink ? '#' : link.href}
                        onClick={(e) => {
                          if (isVaultLink) {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('TRIGGER_VAULT'));
                          }
                          setIsMenuOpen(false);
                        }}
                        className={cn(
                          "text-xs font-bold tracking-[0.3em] p-2 border-b border-[#ff00ff]/5",
                          location.pathname === link.href ? "text-[#ff00ff]" : "text-white/60 hover:text-[#ff00ff]"
                        )}
                      >
                        {link.name}
                      </Link>
                    )
                  })}
                </>
              )}
              
              <div className="flex items-center gap-4 pt-4">
                 <button onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')} className="flex-1 p-3 border border-white/10 rounded-sm text-[10px] flex items-center justify-center gap-2">
                    <Globe size={14} /> {lang}
                 </button>
                 <button onClick={() => setMatrixEnabled(!matrixEnabled)} className={cn("flex-1 p-3 border rounded-sm flex items-center justify-center gap-2", matrixEnabled ? "border-primary-neon text-primary-neon" : "border-white/10")}>
                    <Cpu size={14} /> MATRIX
                 </button>
                 <button onClick={() => setNeonMode(!neonMode)} className={cn("flex-1 p-3 border rounded-sm flex items-center justify-center gap-2", neonMode ? "border-[#ff00ff] text-[#ff00ff]" : "border-white/10")}>
                    <Zap size={14} /> NEON
                 </button>
                 <button onClick={() => toggleMute()} className={cn("flex-1 p-3 border rounded-sm flex items-center justify-center gap-2", !isMuted ? "border-primary-neon text-primary-neon" : "border-white/10")}>
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />} AUDIO
                 </button>
              </div>

              {/* System Diagnostics in Mobile Menu - REDESIGNED */}
              <div className="mt-4 flex flex-col gap-2">
                 <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm">
                       <p className="text-[7px] font-black tracking-widest text-[#00f3ff] uppercase mb-1 flex items-center gap-1.5">
                          <Menu size={8} /> TIME
                       </p>
                       <span className="text-xs font-black text-[#00f3ff] leading-none italic">
                          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>

                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                       <p className="text-[7px] font-black tracking-widest text-[#00f3ff] uppercase mb-1 flex items-center gap-1.5">
                          <Activity size={8} /> UPLINK
                       </p>
                       <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-ping flex-shrink-0" />
                          <span className="text-[7px] font-bold text-white/50 uppercase truncate">
                             {currentlyCoding}
                          </span>
                       </div>
                    </div>
                 </div>

                 <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm">
                    <p className="text-[7px] font-black tracking-widest text-[#00f3ff] uppercase mb-2 flex items-center gap-1.5">
                       <Cpu size={8} /> NODE_HEALTH
                    </p>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[7px] font-bold">
                          <span className="text-white/40 uppercase">CPU_LOAD</span>
                          <span className="text-[#ff00ff]">42%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                             animate={{ width: ['20%', '42%', '38%'] }}
                             transition={{ duration: 5, repeat: Infinity }}
                             className="h-full bg-[#ff00ff] shadow-[0_0_5px_#ff00ff]" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

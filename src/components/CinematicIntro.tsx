import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldCheck, Activity, Cpu, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettings } from '../context/AppContext';
import { useSound } from '../context/SoundContext';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const { introTitle, introSubtitle } = useSettings();
  const { isMuted, toggleMute } = useSound();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('BOOTING...');

  const logSequence = [
    'INITIATING_KERNEL_MODULES...',
    'CONNECTING_TO_GLOBAL_GRID...',
    'BYPASSING_FIREWALL_LAYERS...',
    'DECRYPTING_BIO_SIGNALS...',
    'ESTABLISHING_NEURAL_LINK...',
    'ACCESS_GRANTED_BY_ADMIN',
  ];

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logSequence.length) {
        setLogs(prev => [...prev, logSequence[currentLog]]);
        currentLog++;
      } else {
        clearInterval(logInterval);
        setStatus('COMPLETE');
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const timeout = setTimeout(() => {
      // We don't call onComplete automatically anymore to ensure user interaction
      // onComplete(); 
    }, 4500);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, []); // onComplete removed from deps to avoid auto-firing

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono overflow-hidden"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Scanning Line */}
      <motion.div
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[2px] bg-[#00f3ff]/20 shadow-[0_0_15px_#00f3ff] z-10"
      />

      <div className="relative z-20 w-full max-w-lg px-8 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="relative mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="relative group p-4 rounded-full border border-white/5 bg-white/5 hover:border-[#00f3ff]/40 transition-all flex items-center justify-center overflow-hidden"
              title="TOGGLE_SYSTEM_AUDIO"
            >
               <div className={cn(
                 "absolute inset-0 bg-[#00f3ff]/5 group-hover:bg-[#00f3ff]/10 transition-colors",
                 !isMuted && "animate-pulse"
               )} />
               <Cpu size={64} className={cn("transition-colors", !isMuted ? "text-[#00f3ff]" : "text-white/20")} />
               <div className="absolute bottom-2">
                 {isMuted ? <VolumeX size={16} className="text-white/40" /> : <Volume2 size={16} className="text-[#00f3ff] animate-bounce" />}
               </div>
            </motion.button>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 border border-[#00f3ff]/20 rounded-full border-dashed pointer-events-none"
            />
            {!isMuted && (
              <motion.div 
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-[#00f3ff] rounded-full pointer-events-none"
              />
            )}
          </div>
          <h1 className="text-2xl font-black tracking-[0.5em] text-white italic">{introTitle || 'NEON_HACKER'}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Activity size={12} className="text-[#ff00ff]" />
            <span className="text-[10px] text-[#ff00ff]/60 tracking-widest uppercase">{introSubtitle || 'system_boot_v2.0.9'}</span>
          </div>
        </motion.div>

        <div className="space-y-4 w-full">
          <div className="bg-white/5 border border-white/10 p-4 sm:p-6 h-36 sm:h-48 overflow-hidden rounded-sm relative">
            <div className="flex flex-col gap-1">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-[8px] sm:text-[10px] text-[#00f3ff]/80">
                  <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span>
                  <span className="font-bold">{log}</span>
                </div>
              ))}
              {status !== 'COMPLETE' && (
                <motion.div
                  animate={{ opacity: [0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="w-2 h-3 bg-[#00f3ff] mt-1"
                />
              )}
            </div>
            <div className="absolute top-2 right-2 flex items-center gap-2">
               <ShieldCheck size={14} className={status === 'COMPLETE' ? 'text-green-500' : 'text-[#00f3ff]/20'} />
            </div>
          </div>

          <div className="relative h-1 bg-white/5 overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-white/40 tracking-widest">{status}</span>
            <span className="text-[#00f3ff]">{progress}%</span>
          </div>

          <AnimatePresence>
            {status === 'COMPLETE' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const audio = new Audio('https://www.image2url.com/r2/default/audio/1778421209726-f2242d50-1881-4af0-bbf2-dc9f88f6df3d.mp3');
                  audio.play().catch(e => console.error("Welcome audio playback failed:", e));
                  onComplete();
                }}
                className="w-full mt-6 py-4 bg-[#00f3ff] text-black font-black italic tracking-[0.3em] uppercase transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)]"
              >
                ENTER_THE_GRID
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative Text in corners */}
      <div className="absolute top-8 left-8 text-[8px] text-white/20 space-y-1">
        <p>COORDINATES: 35.6895° N, 139.6917° E</p>
        <p>ENCRYPTION: AES_256_GCM</p>
      </div>
      <div className="absolute bottom-8 right-8 text-[8px] text-white/20 space-y-1 text-right">
        <p>PROTOCOL: NEON_GRID_v4</p>
        <p>REDUNDANCY: ACTIVE</p>
      </div>
    </motion.div>
  );
}

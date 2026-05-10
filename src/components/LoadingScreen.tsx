import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void, key?: string }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const messages = [
    "INITIALIZING KERNEL...",
    "BYPASSING SECURITY FIREWALL...",
    "DECRYPTING NEURAL INTERFACE...",
    "ESTABLISHING SECURE CONNECTION...",
    "UPLOADING IDENTITY CORE...",
    "SYSTEM HACKING INITIATED...",
    "ACCESS GRANTED."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        
        // Add logic to cycle through messages
        if (prev % 15 === 0 && currentLog < messages.length) {
          setLogs(l => [...l, messages[currentLog]].slice(-5));
          currentLog++;
        }
        
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center p-6"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "circIn" }}
    >
      <div className="w-full max-w-md font-mono">
        <div className="mb-8 space-y-2">
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={log + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-cyan-500 text-sm flex items-center gap-2"
              >
                <span className="text-pink-500 opacity-50">{">"}</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_15px_#00ffff]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 flex justify-between text-xs text-white/50 tracking-[0.2em]">
          <span>STATUS: UPLOADING</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="absolute bottom-10 text-[10px] text-pink-500/30 uppercase tracking-[0.5em] animate-pulse">
        Property of Neon Hacker Inc. // Do Not Unauthorized Access
      </div>
    </motion.div>
  );
}

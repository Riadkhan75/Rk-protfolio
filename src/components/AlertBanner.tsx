import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Info, AlertTriangle, X } from 'lucide-react';
import { subscribeToSettings } from '../lib/firebase';

export default function AlertBanner() {
  const [settings, setSettings] = useState<any>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSettings((data) => {
      setSettings(data);
      setClosed(false); // Re-show if settings change
    });
    return () => unsub();
  }, []);

  if (!settings?.showAlert || closed) return null;

  const getIcon = () => {
    switch (settings.alertType) {
      case 'danger': return <ShieldAlert className="text-red-500" />;
      case 'warning': return <AlertTriangle className="text-yellow-500" />;
      default: return <Info className="text-[#00f3ff]" />;
    }
  };

  const getColors = () => {
    switch (settings.alertType) {
      case 'danger': return 'border-red-500/50 bg-red-500/5 text-red-100';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/5 text-yellow-100';
      default: return 'border-[#00f3ff]/50 bg-[#00f3ff]/5 text-[#00f3ff]';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl p-4 border backdrop-blur-md flex items-center gap-4 ${getColors()}`}
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 text-xs font-mono tracking-wider uppercase">
          <span className="font-bold mr-2">[SYSTEM_BROADCAST]:</span>
          {settings.alertMessage}
        </div>
        <button 
          onClick={() => setClosed(true)}
          className="p-1 hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

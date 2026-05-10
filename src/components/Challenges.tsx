import React, { useState } from 'react';
import { motion } from 'motion/react';
import HackingGame from './HackingGame';
import { ShieldCheck, Gift, Download } from 'lucide-react';
import { useSettings } from '../context/AppContext';

export default function Challenges() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { cvUrl } = useSettings();

  const handleComplete = () => {
    setIsUnlocked(true);
  };

  return (
    <div className="py-20 min-h-[80vh] flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="text-[10px] font-mono text-[#ff00ff] uppercase tracking-[0.5em] mb-2 block">Restricted_Access</span>
        <h1 className="text-5xl font-black text-white tracking-widest uppercase italic">Neural_Breach</h1>
        <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm font-mono uppercase tracking-widest leading-relaxed">
          The following assets are protected by high-level encryption. Breach the protocols to unlock the vault.
        </p>
      </motion.div>

      <div className="w-full max-w-4xl mx-auto px-6">
        {!isUnlocked ? (
          <HackingGame onComplete={handleComplete} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#00f3ff]/5 border-2 border-[#00f3ff] p-12 text-center rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.2)]"
          >
            <div className="w-20 h-20 bg-[#00f3ff] text-black rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">VAULT_UNLOCKED</h2>
            <p className="text-[#00f3ff] font-mono text-xs uppercase tracking-widest mb-10">Accessing_Restricted_Content...</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-black/40 border border-[#00f3ff]/20 rounded group hover:border-[#00f3ff] transition-all">
                <Download className="text-[#00f3ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white mb-2 uppercase">Official_CV_V2</h3>
                <a 
                  href={cvUrl || '#'} 
                  download 
                  className="inline-block mt-4 text-[10px] font-mono text-[#00f3ff] underline tracking-widest hover:text-white"
                >
                  DOWNLOAD_NOW
                </a>
              </div>
              <div className="p-6 bg-black/40 border border-[#ff00ff]/20 rounded group hover:border-[#ff00ff] transition-all">
                <Gift className="text-[#ff00ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white mb-2 uppercase">Secret_Archive</h3>
                <p className="text-[10px] text-white/40 uppercase">Encrypted_Payload_Incoming_Soon</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Matrix background only for this page */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0 overflow-hidden font-mono text-[8px] flex flex-wrap gap-2 text-[#00f3ff]">
        {Array.from({ length: 1000 }).map((_, i) => (
          <span key={i}>{Math.random() > 0.5 ? '1' : '0'}</span>
        ))}
      </div>
    </div>
  );
}

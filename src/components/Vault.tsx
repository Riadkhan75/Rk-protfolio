import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, FileText, ImageIcon, Link as LinkIcon, Database, X, Eye, Terminal, Key } from 'lucide-react';
import { subscribeToVault } from '../lib/firebase';
import { useSettings } from '../context/AppContext';

export default function Vault({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const { vaultPassword } = useSettings();

  useEffect(() => {
    // Load lockout state from localStorage
    const savedLockout = localStorage.getItem('vault_lockout_until');
    const savedAttempts = localStorage.getItem('vault_attempts');
    
    if (savedLockout) {
      const until = parseInt(savedLockout);
      if (Date.now() < until) {
        setLockoutUntil(until);
        setRemainingTime(Math.ceil((until - Date.now()) / 1000));
      } else {
        localStorage.removeItem('vault_lockout_until');
        localStorage.removeItem('vault_attempts');
      }
    }
    
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutUntil) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now >= lockoutUntil) {
          setLockoutUntil(null);
          setAttempts(0);
          localStorage.removeItem('vault_lockout_until');
          localStorage.removeItem('vault_attempts');
          clearInterval(interval);
        } else {
          setRemainingTime(Math.ceil((lockoutUntil - now) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  useEffect(() => {
    if (isOpen) {
      const unsub = subscribeToVault(setItems);
      // Reset temporary unlock status but respect lockout
      // Only auto-unlock if we are SURE vaultPassword is empty (after potential load)
      if (vaultPassword) {
        if (!lockoutUntil) {
          setIsUnlocked(false);
        }
      } else if (vaultPassword === '') {
        // This means it is explicitly set to empty (no password)
        setIsUnlocked(true);
      }
      setPasswordInput('');
      setError(false);
      return () => unsub();
    }
  }, [isOpen, vaultPassword, lockoutUntil]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutUntil && Date.now() < lockoutUntil) return;

    if (passwordInput === vaultPassword) {
      setIsUnlocked(true);
      setError(false);
      setAttempts(0);
      localStorage.removeItem('vault_attempts');
      localStorage.removeItem('vault_lockout_until');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      
      if (newAttempts >= 3) {
        const lockoutTime = Date.now() + (60 * 60 * 1000); // 1 hour
        setLockoutUntil(lockoutTime);
        localStorage.setItem('vault_lockout_until', lockoutTime.toString());
      } else {
        localStorage.setItem('vault_attempts', newAttempts.toString());
      }

      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isOpen) return null;

  const isLockedOut = lockoutUntil && Date.now() < lockoutUntil;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-red-500/30 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]"
      >
        {/* Header */}
        <div className="p-6 border-b border-red-500/20 flex items-center justify-between bg-red-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-sm">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter text-white">CLASSIFIED_VAULT</h2>
              <p className="text-[10px] text-red-500/60 uppercase tracking-widest mt-1">Status: {isUnlocked ? 'ACCESS_LEVEL_OMEGA' : 'LOCKED_SECTOR'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 h-[60vh] overflow-y-auto custom-scrollbar relative">
          {!isUnlocked ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8">
              <motion.div 
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="w-16 h-16 rounded-full border-2 border-red-500/30 flex items-center justify-center text-red-500"
              >
                <Lock size={32} />
              </motion.div>
              
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.3em]">
                  {isLockedOut ? 'SYSTEM_LOCKED' : 'Neural_Key_Required'}
                </h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                  {isLockedOut 
                    ? `SECURITY_BREACH_DETECTED. LOCKOUT_ACTIVE: ${formatTime(remainingTime)} REMAINING`
                    : 'Identify yourself to access the classified grid'}
                </p>
              </div>

              <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/50">
                    {isLockedOut ? <Shield size={14} /> : <Key size={14} />}
                  </div>
                  <input 
                    type="password"
                    autoFocus
                    disabled={isLockedOut}
                    placeholder={isLockedOut ? "LOCKED_OUT" : "ENTER_ACCESS_CODE"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className={`w-full bg-black border ${error ? 'border-red-500 bg-red-500/5' : 'border-white/10'} p-3 pl-10 text-xs text-white placeholder:text-white/10 focus:border-red-500 outline-none font-mono tracking-[0.5em] transition-all ${isLockedOut ? 'opacity-20 cursor-not-allowed' : ''}`}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLockedOut}
                  className={`w-full py-3 bg-red-500 text-black font-black text-xs tracking-[0.3em] hover:bg-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] ${isLockedOut ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  {isLockedOut ? 'LINK_DISABLED' : 'DECRYPT_ACCESS'}
                </button>
              </form>

              {error && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">
                  {isLockedOut ? 'MAX_ATTEMPTS_EXCEEDED: LOCKDOWN_INITIATED' : `Invalid_Key_Protocol: Access_Denied (${3 - attempts} attempts left)`}
                </p>
              )}
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <Lock size={48} className="text-white/10 animate-pulse" />
              <p className="text-xs text-white/20 uppercase tracking-[0.3em]">No classified data found in this sector.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative glass-card p-6 border-red-500/20 hover:border-red-500/50 cursor-crosshair transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={12} className="text-red-500" />
                  </div>
                  
                  <div className="mb-4 text-red-500/40">
                    {item.type === 'image' && <ImageIcon size={20} />}
                    {item.type === 'text' && <FileText size={20} />}
                    {item.type === 'link' && <LinkIcon size={20} />}
                    {item.type === 'file' && <Shield size={20} />}
                  </div>

                  <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-widest line-clamp-1">{item.title}</h3>
                  <div className="w-full h-1 bg-white/5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Item Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col"
            >
              <div className="p-6 border-b border-red-500/20 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#00f3ff] uppercase tracking-[0.4em]">{selectedItem.title}</h3>
                <button onClick={() => setSelectedItem(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <div className="flex-1 p-10 overflow-y-auto flex flex-col items-center justify-center">
                 {selectedItem.type === 'image' && (
                    <div className="space-y-6 w-full max-w-2xl text-center">
                       <img src={selectedItem.content || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'} alt={selectedItem.title} className="w-full h-auto border border-white/10 rounded-sm shadow-[0_0_20px_#ef4444]" />
                       <p className="text-xs text-white/60 font-mono italic">DECRYPTED_IMAGE_PACKET</p>
                    </div>
                 )}
                 {selectedItem.type === 'text' && (
                    <div className="glass-card p-10 border-red-500/30 max-w-2xl w-full">
                       <p className="text-sm text-white/80 leading-relaxed font-mono whitespace-pre-wrap">{selectedItem.content}</p>
                    </div>
                 )}
                 {selectedItem.type === 'link' && (
                    <div className="text-center space-y-6">
                       <p className="text-xs text-white/40 uppercase tracking-widest">EXTERNAL_ENDPOINT_LOCATED</p>
                       <a 
                         href={selectedItem.content} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-block px-10 py-4 bg-red-500 text-black font-black text-xs hover:bg-white transition-all shadow-[0_0_20px_#ef4444]"
                       >
                         OPEN_SECURE_LINK
                       </a>
                    </div>
                 )}
                 {selectedItem.type === 'file' && (
                    <div className="text-center space-y-6">
                        <Shield size={64} className="text-red-500 mx-auto animate-pulse" />
                        <div className="space-y-2">
                           <p className="text-sm font-bold text-white tracking-widest">ENCRYPTED_FILE_PACKAGE</p>
                           <p className="text-[10px] text-white/40 font-mono">{selectedItem.content}</p>
                        </div>
                        <button className="px-8 py-3 border border-red-500 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-black transition-all">DOWNLOAD_DECRYPTED</button>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="p-4 bg-red-500/5 border-t border-red-500/10 flex justify-between items-center px-8">
           <span className="text-[8px] text-red-500/40 uppercase tracking-[0.5em]">Sector: 7G // Auth: OMEGA</span>
           <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-3 bg-red-500/20" />
              ))}
           </div>
        </div>
      </motion.div>
    </div>
  );
}

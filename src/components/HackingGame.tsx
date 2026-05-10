import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Unlock, AlertCircle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { subscribeToChallenges } from '../lib/firebase';

const FALLBACK_CHALLENGES = [
  {
    target: 'NEON',
    hint: 'Element 10 in the grid.',
    limit: 5
  },
  {
    target: '7331',
    hint: 'Leet speak for LEET.',
    limit: 5
  },
  {
    target: 'ROOT',
    hint: 'Superuser core access.',
    limit: 3
  }
];

export default function HackingGame({ onComplete }: { onComplete: () => void }) {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [logs, setLogs] = useState<string[]>(['INITIALIZING_HACK_PROTOCOL...']);

  useEffect(() => {
    const unsub = subscribeToChallenges((data) => {
      if (data && data.length > 0) {
        setChallenges(data);
      } else {
        setChallenges(FALLBACK_CHALLENGES);
      }
    });
    return () => unsub();
  }, []);

  const currentChallenge = challenges[level] || FALLBACK_CHALLENGES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'success' || !currentChallenge) return;

    if (input.toUpperCase() === currentChallenge.target.toUpperCase()) {
      setStatus('success');
      setLogs(prev => [...prev, `[SUCCESS] ACCESS_GRANTED_LVL_${level+1}`]);
      
      setTimeout(() => {
        if (level < challenges.length - 1) {
          setLevel(prev => prev + 1);
          setInput('');
          setStatus('idle');
          setAttempts(0);
          setLogs(['PROTOCOL_ADVANCED...', 'WAITING_FOR_UPLINK...']);
        } else {
          onComplete();
        }
      }, 2000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setLogs(prev => [...prev, `[ERROR] INVALID_SEQUENCE (ATTEMPT ${newAttempts}/${currentChallenge.limit})`]);
      
      if (newAttempts >= currentChallenge.limit) {
        setStatus('fail');
        setLogs(prev => [...prev, `[CRITICAL] SYSTEM_LOCKDOWN_ENGAGED`]);
      }
    }
    setInput('');
  };

  const reset = () => {
    setLevel(0);
    setInput('');
    setStatus('idle');
    setAttempts(0);
    setLogs(['INITIALIZING_HACK_PROTOCOL...']);
  };

  return (
    <div className="bg-black/80 border border-[#00f3ff]/30 p-8 rounded-lg font-mono relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Shield size={120} className={status === 'success' ? 'text-[#00f3ff]' : 'text-red-500'} />
      </div>

      <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-[#00f3ff]/10 text-[#00f3ff]">
            {status === 'success' ? <Unlock size={24} /> : <Lock size={24} />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#00f3ff] tracking-widest uppercase">Breach_Protocol_0{level+1}</h3>
            <div className="flex gap-2 items-center mt-1">
               <p className="text-[10px] text-white/40 uppercase">SEC_LEVEL: {currentChallenge.limit > 3 ? 'MODERATE' : 'CRITICAL'}</p>
               {currentChallenge.difficulty && (
                 <span className="text-[8px] px-1 border border-[#00f3ff]/20 text-[#00f3ff] uppercase tracking-widest">{currentChallenge.difficulty}</span>
               )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-black/50 border border-white/5 rounded min-h-[150px] overflow-y-auto custom-scrollbar flex flex-col-reverse">
              {logs.slice().reverse().map((log, i) => (
                <div key={i} className={`text-[9px] mb-1 leading-relaxed ${
                  log.includes('[SUCCESS]') ? 'text-[#00f3ff]' : 
                  log.includes('[ERROR]') ? 'text-red-400' : 
                  log.includes('[CRITICAL]') ? 'text-red-600 font-bold' : 
                  'text-white/40'
                }`}>
                  {`> ${log}`}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {[...Array(currentChallenge.limit)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-1 transition-colors ${
                    i < attempts ? 'bg-red-500' : 'bg-[#00f3ff]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase tracking-widest">HINT_RECEIVED</label>
              <p className="text-xs text-[#00f3ff] italic">{currentChallenge.hint}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={status !== 'idle'}
                  placeholder="ENTER_DECRYPT_KEY"
                  className="w-full bg-transparent border-b-2 border-[#00f3ff]/20 p-2 text-xl outline-none focus:border-[#00f3ff] transition-colors text-center uppercase tracking-[0.5em]"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                   {status === 'success' && <CheckCircle2 className="text-[#00f3ff] animate-ping" size={20} />}
                   {status === 'fail' && <AlertCircle className="text-red-500 animate-pulse" size={20} />}
                </div>
              </div>

              {status === 'fail' ? (
                <button 
                  onClick={reset}
                  className="w-full p-4 border border-red-500 text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                  <RefreshCcw size={16} /> RESTART_SEQUENCE
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={!input.trim() || status !== 'idle'}
                  className="w-full p-4 bg-[#00f3ff] text-black hover:bg-[#00f3ff]/80 font-black text-xs tracking-[0.2em] transition-colors disabled:opacity-20"
                >
                  EXECUTE_DECRYPT
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

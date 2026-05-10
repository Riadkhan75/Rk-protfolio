import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { useSettings } from '../context/AppContext';

export default function AITerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'user' | 'bot', text: string }[]>([
    { type: 'bot', text: 'SYSTEM_BOOT: AI_TERMINAL_V4.2 READY.' },
    { type: 'bot', text: 'Ask me anything about the developer or the system.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { aboutText_EN, skills } = useSettings();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    
    // Command Processing
    if (userMsg.startsWith('/')) {
      const command = userMsg.toLowerCase().split(' ')[0];
      switch (command) {
        case '/clear':
          setHistory([{ type: 'bot', text: 'TERMINAL_CLEARED. READY.' }]);
          return;
        case '/ls':
          setHistory(prev => [...prev, { type: 'bot', text: 'VAULT_DIRECTORIES: /HOME, /ABOUT, /PROJECTS, /SKILLS, /BLOG, /CHALLENGES.' }]);
          return;
        case '/status':
          setHistory(prev => [...prev, { type: 'bot', text: 'SYSTEM_STATUS: NOMINAL. NEURAL_LINK: SECURE. POWER: CORE_STABLE.' }]);
          return;
        case '/vault':
          setHistory(prev => [...prev, { type: 'bot', text: 'ACCESSING_HIDDEN_VAULT... ENCRYPTION: 1024-BIT... ACCESS_GRANTED.' }]);
          // Store event or trigger navigation/modal
          window.dispatchEvent(new CustomEvent('TRIGGER_VAULT'));
          return;
        case '/help':
          setHistory(prev => [...prev, { type: 'bot', text: 'AVAILABLE_COMMANDS: /clear, /ls, /status, /vault, /help.' }]);
          return;
        default:
          setHistory(prev => [...prev, { type: 'bot', text: `ERROR: COMMAND_${command.toUpperCase()}_NOT_FOUND.` }]);
          return;
      }
    }
    
    setIsTyping(true);
    
    const context = `About the developer: ${aboutText_EN}. Skills: ${(skills || []).map(s => s.name).join(', ')}`;
    const response = await chatWithAI(userMsg, context);
    
    setHistory(prev => [...prev, { type: 'bot', text: response || 'NO_RESPONSE_CAPTURED' }]);
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-black border border-[#00f3ff] rounded-full shadow-[0_0_20px_rgba(0,243,255,0.3)] text-[#00f3ff] hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <Terminal size={24} />
        <span className="hidden group-hover:block text-[10px] font-mono font-bold tracking-widest">QUERY_AI</span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? 'auto' : '500px',
          width: isMinimized ? '300px' : '400px'
        }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 bg-black border border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.2)] flex flex-col font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#00f3ff]/20 bg-[#00f3ff]/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse" />
            <span className="text-[10px] font-bold text-[#00f3ff] tracking-widest uppercase">System_Terminal_AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/40 hover:text-[#00f3ff]">
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-red-500">
              <X size={14} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* History */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-[11px]"
            >
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 ${
                    msg.type === 'user' 
                      ? 'bg-white/5 border border-white/10 text-white/80 rounded-l-lg rounded-tr-lg' 
                      : 'text-[#00f3ff] bg-[#00f3ff]/5 border border-[#00f3ff]/20 rounded-r-lg rounded-tl-lg'
                  }`}>
                    <span className="opacity-40 block text-[8px] mb-1 uppercase tracking-tighter">
                      {msg.type === 'user' ? 'USER_PROMPT' : 'SYST_RESP'}
                    </span>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="text-[#00f3ff] bg-[#00f3ff]/5 p-2 rounded-r-lg rounded-tl-lg animate-pulse">
                    THINKING...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[#00f3ff]/20 flex gap-2">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="READY_FOR_COMMAND..."
                className="flex-1 bg-transparent border-none outline-none text-[11px] text-[#00f3ff] placeholder:text-[#00f3ff]/30 h-8"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="text-[#00f3ff] disabled:opacity-30 hover:scale-110 transition-transform"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

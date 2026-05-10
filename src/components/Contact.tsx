import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { Send, 
  Terminal, 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Twitter, 
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Link as LinkIcon,
  MessageCircle,
  Dribbble,
  Figma,
  Slack,
  Twitch,
  Music
} from 'lucide-react';
import { submitContactMessage, subscribeToContacts } from '../lib/firebase';
import { useLanguage } from '../context/AppContext';
import { sendTelegramNotification } from '../lib/telegram';
import Magnetic from './Magnetic';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[SYSTEM]: CONNECTION_STABLE', '[AUTH]: GUEST_SESSION_INITIATED']);
  const [contacts, setContacts] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = subscribeToContacts((data) => {
      setContacts(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const formatUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    return `https://${url}`;
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return Github;
    if (p.includes('linkedin')) return Linkedin;
    if (p.includes('twitter') || p.includes('x.com')) return Twitter;
    if (p.includes('facebook')) return Facebook;
    if (p.includes('instagram')) return Instagram;
    if (p.includes('youtube')) return Youtube;
    if (p.includes('mail')) return Mail;
    if (p.includes('phone') || p.includes('call')) return Phone;
    if (p.includes('whatsapp')) return MessageCircle;
    if (p.includes('discord')) return MessageSquare;
    if (p.includes('telegram')) return Send;
    if (p.includes('dribbble')) return Dribbble;
    if (p.includes('figma')) return Figma;
    if (p.includes('slack')) return Slack;
    if (p.includes('twitch')) return Twitch;
    if (p.includes('spotify') || p.includes('tiktok') || p.includes('music')) return Music;
    return LinkIcon;
  };

  const addLog = (log: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}]: ${log}`].slice(-8));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    
    setStatus('submitting');
    addLog('TRANSMITTING_PACKET...');
    
    try {
      await submitContactMessage(formData.name, formData.email, formData.message);
      
      // Send Telegram notification
      await sendTelegramNotification(
        `<b>New Signal Received!</b>\n\n` +
        `<b>👤 Identity:</b> ${formData.name}\n` +
        `<b>📧 Uplink:</b> ${formData.email}\n` +
        `<b>💬 Transmission:</b>\n<i>${formData.message}</i>`
      );

      setStatus('success');
      addLog('UPLINK_SUCCESSFUL. DATA_STORED.');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      addLog('UPLINK_FAILED. PACKET_LOSS_OCCURRED.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-16 px-4">
        <div className="h-[1px] flex-1 bg-[#00f3ff]/20" />
        <h2 
          className="text-4xl md:text-5xl font-black uppercase tracking-tight glitch-effect text-center"
          data-text={t('contact_title')}
        >
          {t('contact_title')}
        </h2>
        <div className="h-[1px] flex-1 bg-[#ff00ff]/20" />
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Hacker Terminal Form */}
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* Terminal Header */}
          <div className="bg-white/5 border-b border-white/10 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">terminal_secure_v4.2</span>
            </div>
            <div className="flex items-center gap-2 text-[#00f3ff]">
              <MessageSquare size={14} />
              <span className="text-[10px] font-mono animate-pulse">LIVE_CONNECTION</span>
            </div>
          </div>

          <div className="p-8 flex-1 grid md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2 group">
                <label className="block text-[10px] font-mono text-[#00f3ff] uppercase tracking-[0.2em] mb-1">{t('contact_name')}</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="NEON_NOMAD..."
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border-b-2 border-white/10 p-3 font-mono text-sm focus:outline-none focus:border-[#00f3ff] transition-all text-white placeholder:text-white/10"
                    onFocus={() => addLog('INPUT_FOCUS: NAME_FIELD')}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00f3ff] transition-all group-focus-within:w-full shadow-[0_0_10px_#00f3ff]" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-[10px] font-mono text-[#ff00ff] uppercase tracking-[0.2em] mb-1">{t('contact_email')}</label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    placeholder="NOMAD@GRID.NET..."
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black border-b-2 border-white/10 p-3 font-mono text-sm focus:outline-none focus:border-[#ff00ff] transition-all text-white placeholder:text-white/10"
                    onFocus={() => addLog('INPUT_FOCUS: EMAIL_FIELD')}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff00ff] transition-all group-focus-within:w-full shadow-[0_0_10px_#ff00ff]" />
                </div>
              </div>

              <div className="space-y-2 group md:col-span-2">
                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">{t('contact_message')}</label>
                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    placeholder="BROADCAST SIGNAL HERE..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black border-2 border-white/5 p-4 font-mono text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder:text-white/10 resize-none"
                    onFocus={() => addLog('INPUT_FOCUS: MESSAGE_FIELD')}
                  />
                </div>
              </div>

              <Magnetic>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status === 'submitting'}
                  className="w-full skew-button bg-[#00f3ff] text-black hover:bg-white shadow-[0_0_15px_#00f3ff] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="skew-button-label flex items-center justify-center gap-3">
                    {status === 'submitting' ? (
                      <span className="animate-pulse flex items-center gap-2"><Terminal size={16} /> TRANSMITTING...</span>
                    ) : status === 'success' ? (
                      <span className="text-green-900 flex items-center gap-2"><ShieldCheck size={16} /> DELIVERED</span>
                    ) : (
                      <><Send size={16} className="group-hover:translate-x-1 transition-transform" /> {t('contact_submit')}</>
                    )}
                  </span>
                </motion.button>
              </Magnetic>
            </form>

            <div className="bg-black/50 border border-white/5 p-6 rounded-sm flex flex-col h-full min-h-[300px]">
              <div className="flex items-center gap-2 mb-4 text-[#00f3ff]">
                <Terminal size={14} />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Live_Console_Logs</span>
              </div>
              <div ref={scrollRef} className="flex-1 font-mono text-[10px] text-white/30 space-y-2 overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {terminalLogs.map((log, i) => (
                    <motion.p
                      key={log + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="leading-relaxed"
                    >
                      <span className="text-[#00f3ff] opacity-50">{">"}</span> {log}
                    </motion.p>
                  ))}
                </AnimatePresence>
                <div className="w-2 h-4 bg-[#00f3ff]/50 animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </div>

        {/* Social Grid Side */}
        <div className="space-y-6">
          <div className="glass-card p-8 border-l-4 border-l-[#ff00ff]">
            <h3 className="text-[#ff00ff] font-mono text-xs mb-8 tracking-[0.4em] uppercase">Connect_Nodes</h3>
            <div className="grid grid-cols-2 gap-4">
              {contacts.length > 0 ? (
                contacts.map((contact) => {
                  const Icon = getPlatformIcon(contact.platform);
                  return (
                    <a
                      key={contact.id}
                      href={formatUrl(contact.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 border border-white/10 hover:border-[#ff00ff]/50 transition-all flex flex-col items-center gap-3 group text-[#ff00ff]"
                    >
                      <Icon size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-white/50 group-hover:text-white transition-colors">{contact.platform}</span>
                    </a>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8 text-[10px] text-white/20 uppercase tracking-widest font-mono italic">
                  NO_SIGNAL_FOUND
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-[#00f3ff]/10 to-transparent">
             <div className="flex items-center gap-3 mb-4 text-[#00f3ff]">
                <ShieldCheck size={18} />
                <span className="text-xs font-mono tracking-widest">SECURE_COMM_v2</span>
             </div>
             <p className="text-[10px] font-mono text-white/40 leading-relaxed italic">
                All communications are protected by quantum-grade encryption layers. Your identity signals are scrubbed for metadata before transmission.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}

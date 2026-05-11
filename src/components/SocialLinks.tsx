import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Send,
  MessageSquare,
  Music,
  Link as LinkIcon,
  Flame
} from 'lucide-react';
import { subscribeToContacts } from '../lib/firebase';

export default function SocialLinks() {
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    const unsub = subscribeToContacts((data) => {
      setLinks(data);
    });
    return () => unsub();
  }, []);

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return Github;
    if (p.includes('linkedin')) return Linkedin;
    if (p.includes('twitter') || p.includes(' x')) return Twitter;
    if (p.includes('facebook')) return Facebook;
    if (p.includes('instagram')) return Instagram;
    if (p.includes('youtube')) return Youtube;
    if (p.includes('telegram')) return Send;
    if (p.includes('discord')) return MessageSquare;
    if (p.includes('tiktok')) return Music;
    if (p.includes('free fire') || p.includes('gaming')) return Flame;
    return LinkIcon;
  };

  if (links.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-20 max-w-[1400px] mx-auto">
      <div className="flex flex-col items-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-[#00f3ff] text-xs font-mono tracking-[0.5em] uppercase mb-2 block">
            STAY_CONNECTED
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter mb-4">
            SOCIAL_NETWORKS
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#00f3ff] via-[#ff00ff] to-transparent mx-auto" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {links.map((link, index) => {
          const Icon = getPlatformIcon(link.platform);
          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-[#00f3ff] opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-xl" />
              <div className="hologram-card p-6 border border-white/10 flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-sm transition-all group-hover:border-[#00f3ff]/50">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/60 group-hover:text-[#00f3ff] transition-colors relative overflow-hidden">
                   <Icon size={24} className="relative z-10" />
                   <div className="absolute inset-0 bg-[#00f3ff] opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                  {link.platform}
                </span>
                
                {/* HUD Decoration */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-[#00f3ff]" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-[#00f3ff]" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}

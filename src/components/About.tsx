import { motion } from 'motion/react';
import { User, MapPin, Briefcase, Clock, Activity, Cpu } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import { useLanguage, useSettings } from '../context/AppContext';
import { useState, useEffect } from 'react';
import { subscribeToSkills, subscribeToProjects } from '../lib/firebase';

export default function About() {
  const { t, lang } = useLanguage();
  const { 
    aboutText_EN, 
    aboutText_BN, 
    profileImage,
    adminName,
    adminRole,
    adminLocation,
    adminExperience
  } = useSettings();
  const [skills, setSkills] = useState<any[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    const unsubSkills = subscribeToSkills((data) => {
      setSkills(data);
    });
    const unsubProjects = subscribeToProjects((data) => {
      setProjectsCount(data.length);
    });
    return () => {
      unsubSkills();
      unsubProjects();
    };
  }, []);

  const stats = [
    { label: lang === 'EN' ? 'NAME' : 'নাম', value: adminName || 'NEON_HACKER' },
    { label: lang === 'EN' ? 'ROLE' : 'ভুমিকা', value: adminRole || 'UI_ARCHITECT' },
    { label: lang === 'EN' ? 'EXPERIENCE' : 'অভিজ্ঞতা', value: adminExperience || '7+ CYCLES' },
    { label: lang === 'EN' ? 'LOCATION' : 'অবস্থান', value: adminLocation || 'NEO_TOKYO_GRID' },
  ];

  const defaultAbout = lang === 'EN' ? 
    'I am a digital architect specialized in building high-fidelity neural interfaces and scalable grid infrastructures. My methodology merges brutalist functionalism with futuristic neon aesthetics to create immersive user experiences that survive the cyberpunk era.' : 
    'আমি একজন ডিজিটাল আর্কিটেক্ট, যিনি হাই-ফিডেলিটি নিউরাল ইন্টারফেসে এবং স্কেলেবল গ্রিড ইনফ্রাস্ট্রাকচার তৈরিতে বিশেষজ্ঞ। আমার পদ্ধতি ব্রুটালিস্ট ফাংশনালিজমকে ফিউচারিস্টিক নিয়ন নান্দনিকতার সাথে একীভূত করে এক অসাধারণ ব্যবহারকারীর অভিজ্ঞতা তৈরি করে।';

  const finalAbout = lang === 'EN' ? (aboutText_EN || defaultAbout) : (aboutText_BN || defaultAbout);
  const finalProfileImage = (profileImage && profileImage.trim() !== '') ? profileImage : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80";

  return (
    <section id="about" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
      <div className="mb-16">
        <h2 
          className="text-4xl md:text-5xl font-black uppercase tracking-tight glitch-effect inline-block"
          data-text={t('about_title')}
        >
          {t('about_title')}
        </h2>
        <div className="h-1 w-24 bg-[#00f3ff] mt-4" />
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-12">
        {/* Left: Profile Side */}
        <div className="space-y-8">
          <div className="relative aspect-square group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
            <div className="relative h-full w-full bg-black border-2 border-[#00f3ff] overflow-hidden">
              <img 
                src={finalProfileImage} 
                alt="Profile" 
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
              />
              {/* Scanline Overlay Specific to Image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f3ff]/10 to-transparent h-20 w-full animate-[scan_3s_linear_infinite] pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 border border-[#00f3ff]/50 flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00f3ff] rounded-full animate-pulse shadow-[0_0_8px_#00f3ff]" />
                <span className="text-[10px] font-mono tracking-[0.2em]">STATUS: ONLINE</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-4 border-l-[#ff00ff]">
            <h3 className="text-[#ff00ff] font-mono text-xs mb-6 tracking-[0.3em] flex items-center gap-2">
              <Cpu size={14} /> CORE_PROTOCOL_STRENGTH
            </h3>
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.id || skill.name} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-white/60 uppercase">{skill.name}</span>
                    <span className="text-[#ff00ff]">{skill.level}%</span>
                  </div>
                  <div className="h-1 bg-white/10 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" 
                    />
                  </div>
                </div>
              ))}
              {skills.length === 0 && (
                <div className="text-[10px] text-white/20 uppercase tracking-widest text-center py-4">
                  Loading_Neural_Protocols...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Info Panels */}
        <div className="space-y-8">
          <div className="glass-card p-8 bg-black/40 border-t-4 border-t-[#00f3ff]">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff]">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono tracking-widest text-[#00f3ff]">BIO_ENCRYPTION_STREAM</h3>
                <p className="text-[10px] text-white/40 tracking-[0.2em]">DECRYPTING PERSONAL DATA...</p>
              </div>
            </div>

            <div className="text-lg font-mono text-white/80 leading-relaxed italic min-h-[120px]">
              <Typewriter
                words={[finalAbout]}
                typeSpeed={30}
                cursor
                cursorStyle="_"
              />
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 grid sm:grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <div className="text-[10px] text-[#00f3ff] font-mono mb-1 tracking-[0.2em]">{stat.label}</div>
                  <div className="text-white font-mono tracking-widest border-b border-transparent group-hover:border-[#ff00ff] transition-all inline-block">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 font-mono">
            <div className="bg-[#00f3ff]/5 border border-[#00f3ff]/20 p-6 relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-4">
                 <Briefcase className="text-[#00f3ff]" size={20} />
                 <span className="text-xs tracking-[0.2em]">PROJECT_LOAD</span>
               </div>
               <div className="text-3xl font-black text-white">{projectsCount}+</div>
               <div className="text-[10px] text-white/40 mt-1">COMPLETED_CYCLES</div>
               <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
                 <Briefcase size={80} />
               </div>
            </div>

            <div className="bg-[#ff00ff]/5 border border-[#ff00ff]/20 p-6 relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-4">
                 <Clock className="text-[#ff00ff]" size={20} />
                 <span className="text-xs tracking-[0.2em]">UPTIME_STATUS</span>
               </div>
               <div className="text-3xl font-black text-white">99.9%</div>
               <div className="text-[10px] text-white/40 mt-1">RELIABILITY_RATIO</div>
               <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 -rotate-12 transition-transform group-hover:rotate-0">
                 <Clock size={80} />
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(500%); }
        }
      `}</style>
    </section>
  );
}

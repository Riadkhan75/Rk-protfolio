import { motion } from 'motion/react';
import { Cpu, Globe, Database, Shield, Box, Activity } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, PolarRadiusAxis 
} from 'recharts';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/AppContext';
import SkillTree from './SkillTree';

const radarData = [
  { subject: 'Frontend', A: 95, fullMark: 100 },
  { subject: 'Backend', A: 85, fullMark: 100 },
  { subject: 'Security', A: 75, fullMark: 100 },
  { subject: 'DevOps', A: 80, fullMark: 100 },
  { subject: 'UI/UX', A: 90, fullMark: 100 },
  { subject: 'Neural', A: 70, fullMark: 100 },
];

const skillCategories = [
  {
    title: 'FRONTEND_SYSTEMS',
    icon: Globe,
    color: '#00f3ff',
    skills: [
      { name: 'React/Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 98 },
      { name: 'Three.js', level: 75 },
    ]
  },
  {
    title: 'BACKEND_INFRA',
    icon: Database,
    color: '#ff00ff',
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'Firebase', level: 90 },
      { name: 'Rust', level: 65 },
    ]
  },
  {
    title: 'CYBER_SECURITY',
    icon: Shield,
    color: '#9d00ff',
    skills: [
      { name: 'Penetration Testing', level: 78 },
      { name: 'Cryptography', level: 72 },
      { name: 'Security Audit', level: 85 },
      { name: 'Auth Protocols', level: 92 },
    ]
  }
];

function CircularGauge({ level, color, label }: { level: number, color: string, label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = level / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= level) {
        setCount(level);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [level]);

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-white/5 fill-none"
            strokeWidth="6"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            className="fill-none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
          {count}%
        </div>
      </div>
      <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">{label}</span>
    </div>
  );
}

export default function Skills() {
  const { t } = useLanguage();
  return (
    <section id="skills" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col items-center sm:items-end mb-16 text-center sm:text-right">
        <h2 
          className="text-4xl md:text-5xl font-black uppercase tracking-tight glitch-effect"
          data-text={t('skills_title')}
        >
          {t('skills_title')}
        </h2>
        <div className="h-1 w-24 bg-[#ff00ff] mt-4" />
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Main Skills Grid */}
        <div className="grid gap-6">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 border-l-4"
              style={{ borderLeftColor: cat.color }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-white/5 border border-white/10 text-[#00f3ff]">
                  <cat.icon size={20} />
                </div>
                <h3 className="font-mono font-black tracking-[0.2em] text-sm text-white/80">{cat.title}</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/60 italic">{skill.name}</span>
                      <span className="text-white">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="h-full"
                        style={{ 
                          backgroundColor: cat.color,
                          boxShadow: `0 0 10px ${cat.color}`
                        }}
                      />
                      {/* Secondary scanning line */}
                      <motion.div 
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 h-full w-20 bg-white/20 skew-x-[-30deg]" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar: Dashboard Display */}
        <div className="space-y-8">
          <div className="glass-card p-6 border-t-4 border-t-[#00f3ff]">
            <h3 className="text-[10px] font-mono tracking-[0.4em] text-[#00f3ff] mb-8 uppercase flex items-center gap-2">
              <Activity size={12} /> NEURAL_LOAD_RADAR
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'monospace' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Hacker"
                    dataKey="A"
                    stroke="#00f3ff"
                    fill="#00f3ff"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 flex justify-around items-center">
            <CircularGauge level={92} color="#00f3ff" label="UPTIME" />
            <CircularGauge level={88} color="#ff00ff" label="SYNC" />
            <CircularGauge level={95} color="#9d00ff" label="DATA" />
          </div>

          <div className="bg-white/5 p-4 font-mono text-[9px] text-white/40 space-y-1">
             <p className="flex justify-between"><span>CPU_CORES</span> <span className="text-[#00f3ff]">16_ACTIVE</span></p>
             <p className="flex justify-between"><span>MEM_RESERVE</span> <span className="text-[#ff00ff]">32GB_SECURED</span></p>
             <p className="flex justify-between"><span>LATENCY</span> <span className="text-green-500">0.02ms</span></p>
             <p className="text-center pt-2 animate-pulse">{">>>"} SCANNING_FOR_VULNERABILITIES...</p>
          </div>
        </div>
      </div>

      <div className="mt-32">
        <SkillTree />
      </div>
    </section>
  );
}

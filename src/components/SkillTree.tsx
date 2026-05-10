import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../context/AppContext';
import { Cpu, Globe, Database, Terminal, Layers } from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Frontend: Globe,
  Backend: Database,
  DevOps: Terminal,
  Tools: Cpu,
  Language: Layers,
};

export default function SkillTree() {
  const { skills } = useSettings();

  const groupedSkills = useMemo(() => {
    const groups: Record<string, typeof skills> = {};
    if (!skills || !Array.isArray(skills)) return groups;
    
    skills.forEach(skill => {
      const cat = skill.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });
    return groups;
  }, [skills]);

  const categories = Object.keys(groupedSkills);

  return (
    <div className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#00f3ff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="text-[10px] font-mono text-[#00f3ff] uppercase tracking-[0.5em] mb-2 block">System_Abilities</span>
          <h2 className="text-4xl font-black text-white tracking-widest uppercase">Skill_Node_Tree</h2>
          <div className="w-24 h-1 bg-[#00f3ff] mx-auto mt-4" />
        </motion.div>

        <div className="relative flex flex-col md:flex-row justify-center gap-12 md:gap-24">
          {/* Central Line for Mobile */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#00f3ff]/20 md:hidden" />

          {categories.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat] || Layers;
            return (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col items-center group"
              >
                {/* Category Node */}
                <div className="w-20 h-20 rounded-full border-2 border-[#00f3ff] bg-black flex items-center justify-center text-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.2)] group-hover:scale-110 transition-transform z-20">
                  <Icon size={32} />
                  <div className="absolute -top-8 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap opacity-60">
                    {cat.toUpperCase()}
                  </div>
                </div>

                {/* Connection Line to Skills */}
                <div className="w-[2px] h-12 bg-gradient-to-bottom from-[#00f3ff] to-transparent" />

                {/* Skill Nodes */}
                <div className="flex flex-col gap-4 mt-2">
                  {groupedSkills[cat].map((skill, sIdx) => (
                    <motion.div 
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (idx * 0.1) + (sIdx * 0.05) }}
                      className="px-4 py-2 bg-[#00f3ff]/5 border border-[#00f3ff]/20 hover:border-[#00f3ff]/50 text-[#00f3ff] text-xs font-mono tracking-widest rounded-sm flex items-center gap-3 relative group/item"
                    >
                      <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-pulse" />
                      {skill.name}
                      <div className="absolute -right-12 text-[8px] font-bold opacity-0 group-hover/item:opacity-100 transition-opacity">
                        LV.{skill.level}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

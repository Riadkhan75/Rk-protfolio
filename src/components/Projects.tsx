import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ExternalLink, Github, Box, Activity } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { subscribeToProjects } from '../lib/firebase';
import { useLanguage } from '../context/AppContext';

function ProjectCard({ project, index, t }: { project: any, index: number, t: any, key?: any }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="glass-card group border-l-4 border-l-[#00f3ff]/50 relative cursor-pointer"
      onClick={() => project.link && window.open(project.link, '_blank')}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00f3ff]/10 via-transparent to-[#ff00ff]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative h-48 overflow-hidden" style={{ transform: "translateZ(50px)" }}>
        <img 
          src={project.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="p-2 bg-black/80 backdrop-blur-md text-[#00f3ff] border border-[#00f3ff]/30">
            <Box size={16} />
          </div>
        </div>
      </div>

      <div className="p-6" style={{ transform: "translateZ(30px)" }}>
        <h3 className="text-xl font-bold mb-2 font-mono group-hover:text-[#00f3ff] transition-colors flex items-center gap-2">
          <span className="text-[10px] text-white/20">0{index + 1}</span>
          {project.title}
        </h3>
        <p className="text-white/60 text-sm mb-6 line-clamp-2 italic font-light">
          {project.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((t: string) => (
            <span key={t} className="text-[10px] font-mono px-2 py-1 bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff]">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ x: 5 }}
            onClick={(e) => { e.stopPropagation(); window.open(project.link, '_blank'); }}
            className="flex items-center gap-2 text-xs font-mono text-white/50 hover:text-[#00f3ff] transition-colors uppercase tracking-[0.2em]"
          >
            <ExternalLink size={14} /> LIVE_VIEW
          </motion.button>
          <motion.a 
            href={project.github} 
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-xs font-mono text-white/50 hover:text-[#ff00ff] transition-colors uppercase tracking-[0.2em]"
          >
            <Github size={14} /> SOURCE_CODE
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = subscribeToProjects((data) => {
      const filtered = data
        .filter((p: any) => p.status !== 'draft')
        .sort((a: any, b: any) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
      setProjects(filtered);
    });
    return () => unsub();
  }, []);

  return (
    <section id="projects" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
      <div className="mb-16 px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 
            className="text-4xl md:text-5xl font-black uppercase tracking-tight glitch-effect inline-block"
            data-text={t('projects_title')}
          >
            {t('projects_title')}
          </h2>
          <div className="h-1 w-24 bg-[#00f3ff] mt-4" />
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 backdrop-blur-md">
           <Activity size={16} className="text-[#00f3ff] animate-pulse" />
           <div className="font-mono">
              <span className="text-[10px] text-white/40 uppercase block leading-none mb-1">REALTIME_PROJECT_COUNT</span>
              <span className="text-xl font-bold text-[#00f3ff]">{projects.length.toString().padStart(2, '0')}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id || project.title + index}
            className={`${
              index % 4 === 0 ? "lg:col-span-2 lg:row-span-1" : 
              index % 4 === 3 ? "lg:row-span-2" : ""
            }`}
          >
            <ProjectCard project={project} index={index} t={t} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

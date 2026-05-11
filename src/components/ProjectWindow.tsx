import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, Monitor, Terminal, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectWindowProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    link: string;
  } | null;
}

export default function ProjectWindow({ isOpen, onClose, project }: ProjectWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (project) {
      setIsLoading(true);
      setUrl(project.link);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        <motion.div
          drag={!isMaximized}
          dragMomentum={false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "bg-black border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto transition-all duration-300",
            isMaximized ? "w-full h-full" : "w-full max-w-5xl h-[85vh] rounded-lg"
          )}
        >
          {/* OS Title Bar */}
          <div className="h-10 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-4 select-none cursor-move">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <button 
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all flex items-center justify-center group"
                >
                  <X size={8} className="text-black opacity-0 group-hover:opacity-100" />
                </button>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-50" />
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all flex items-center justify-center group"
                >
                  <Maximize2 size={8} className="text-black opacity-0 group-hover:opacity-100" />
                </button>
              </div>
              <div className="h-4 w-[1px] bg-white/10 mx-1" />
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                <Terminal size={10} className="text-primary-neon" />
                <span>PROJECT_EXEC: {project.title.replace(/\s+/g, '_')}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase">
                <Monitor size={10} />
                <span>SESSION_STABLE</span>
              </div>
            </div>
          </div>

          {/* Browser-style toolbar */}
          <div className="h-12 bg-[#252525] border-b border-white/5 flex items-center gap-4 px-4">
            <div className="flex items-center gap-2 text-white/40">
              <button className="p-1.5 hover:bg-white/5 rounded-md transition-all cursor-not-allowed"><ChevronLeft size={16} /></button>
              <button className="p-1.5 hover:bg-white/5 rounded-md transition-all cursor-not-allowed"><ChevronRight size={16} /></button>
              <button 
                onClick={() => {
                  setIsLoading(true);
                  const currentUrl = url;
                  setUrl('');
                  setTimeout(() => setUrl(currentUrl), 50);
                }}
                className="p-1.5 hover:bg-white/5 rounded-md transition-all text-primary-neon"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="flex-1 bg-black/40 border border-white/10 rounded-md h-8 flex items-center px-3 gap-2 group focus-within:border-primary-neon transition-all">
              <Globe size={12} className="text-white/20 group-focus-within:text-primary-neon" />
              <span className="text-[10px] font-mono text-white/40 truncate select-all">{url}</span>
            </div>

            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 h-8 bg-primary-neon/10 border border-primary-neon/20 hover:bg-primary-neon/20 transition-all text-primary-neon text-[10px] font-bold flex items-center gap-2 rounded-md uppercase tracking-wider"
            >
              <ExternalLink size={12} />
              <span>Detach</span>
            </a>
          </div>

          {/* Project Viewport */}
          <div className="flex-1 bg-[#0a0a0a] relative">
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-16 h-16 relative mb-6">
                    <div className="absolute inset-0 border-2 border-primary-neon/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-primary-neon rounded-full animate-spin shadow-[0_0_15px_#00f3ff]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black italic text-white tracking-[0.3em] uppercase">Booting_System</h3>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono text-primary-neon/60 uppercase">Injecting_Dependencies... [OK]</span>
                      <span className="text-[8px] font-mono text-primary-neon/60 uppercase">Resolving_Uplink... [OK]</span>
                      <span className="text-[8px] font-mono text-primary-neon/60 uppercase">Rendering_Buffer... [IN_PROGRESS]</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <iframe
              src={url || 'about:blank'}
              className="w-full h-full border-none bg-white"
              onLoad={() => setIsLoading(false)}
              title={project.title}
            />
          </div>

          {/* OS Footer */}
          <div className="h-6 bg-[#1a1a1a] border-t border-white/10 flex items-center justify-between px-4 text-[8px] font-mono text-white/30 uppercase tracking-[0.1em]">
            <div className="flex items-center gap-4">
              <span>PROT: HTTPS_SECURE</span>
              <span>RES: {isMaximized ? 'FULLSCREEN' : 'WINDOWED_HD'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary-neon">ENCRYPTION: 1024-BIT</span>
              <span className="animate-pulse">● V_ACTIVE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

export default function ResumeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl h-full max-h-[90vh] bg-black border border-[#00f3ff]/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#00f3ff]/10 text-[#00f3ff]">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-mono font-bold tracking-widest text-[#00f3ff]">NEON_RESUME_v2.PDF</h3>
                  <p className="text-[10px] text-white/40 font-mono">FILE_SIZE: 1.2MB // TYPE: ENCRYPTED_PDF</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#00f3ff] text-black font-mono text-xs font-bold hover:bg-white transition-colors"
                >
                  <Download size={14} />
                  DOWNLOAD_LOCAL
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Resume Viewer Body */}
            <div className="flex-1 bg-[#0a0a0a] overflow-hidden relative p-4 flex flex-col">
              <div className="flex-1 border border-white/5 bg-white/[0.02] relative overflow-hidden flex flex-col items-center justify-center">
                 {/* This would be an iframe or an image of the resume in a real app */}
                 <div className="text-center space-y-6 max-w-md p-12 relative z-10">
                    <div className="w-16 h-16 bg-[#00f3ff]/10 border border-[#00f3ff] mx-auto flex items-center justify-center animate-pulse">
                      <FileText size={32} className="text-[#00f3ff]" />
                    </div>
                    <h4 className="text-2xl font-black font-mono text-[#00f3ff]">ENCRYPTED_VIEWER_ACTIVE</h4>
                    <p className="text-xs font-mono text-white/50 leading-relaxed italic">
                      SYSTEM_NOTICE: The high-fidelity document viewer requires biometric verification. For this demo, a full-resolution data-stream is simulated below.
                    </p>
                    <div className="pt-8 grid grid-cols-2 gap-4">
                       <div className="h-40 bg-white/5 border border-white/10 flex flex-col items-center justify-center p-4">
                          <span className="text-[10px] text-white/20 mb-2">PAGE_01</span>
                          <div className="w-full space-y-2 opacity-20">
                             <div className="h-2 bg-[#00f3ff] w-3/4 mx-auto" />
                             <div className="h-2 bg-white w-full" />
                             <div className="h-2 bg-white w-5/6 mx-auto" />
                          </div>
                       </div>
                       <div className="h-40 bg-white/5 border border-white/10 flex flex-col items-center justify-center p-4">
                          <span className="text-[10px] text-white/20 mb-2">PAGE_02</span>
                          <div className="w-full space-y-2 opacity-20">
                             <div className="h-2 bg-[#ff00ff] w-1/2 mx-auto" />
                             <div className="h-2 bg-white w-full" />
                             <div className="h-2 bg-white w-2/3 mx-auto" />
                          </div>
                       </div>
                    </div>
                    <button className="flex items-center gap-2 mx-auto text-xs font-mono text-[#00f3ff] hover:underline pt-8">
                       <ExternalLink size={14} /> OPEN_IN_NEW_TAB.INIT
                    </button>
                 </div>

                 {/* Decorative Brackets inside viewer */}
                 <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#00f3ff]/30" />
                 <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#00f3ff]/30" />
                 <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#00f3ff]/30" />
                 <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#00f3ff]/30" />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center px-8">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_green]" />
                    <span className="text-[8px] font-mono text-white/40 uppercase">SCAN_SECURE</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#00f3ff] rotate-45" />
                    <span className="text-[8px] font-mono text-white/40 uppercase">VERIFIED_SOURCE</span>
                 </div>
              </div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">© 2026 NEON_HACKER_RESUME_CORE</span>
            </div>

            {/* Corner Deco */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#00f3ff]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ff00ff]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

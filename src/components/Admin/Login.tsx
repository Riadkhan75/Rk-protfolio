import { useState } from 'react';
import { motion } from 'motion/react';
import { loginWithGoogle, auth } from '../../lib/firebase';
import { Shield, Lock, Terminal, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/adminriad');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-10 border-t-4 border-t-[#00f3ff] shadow-[0_0_50px_rgba(0,243,255,0.1)]">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 relative group">
              <Shield size={40} className="text-[#00f3ff] group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 border border-[#00f3ff] rounded-full animate-ping opacity-20" />
            </div>
            
            <h1 className="text-3xl font-black font-mono tracking-tighter mb-2 italic">
              ADMIN_<span className="text-[#00f3ff]">GATEWAY</span>
            </h1>
            <p className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">
              Secure Terminal Access
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-black/50 border border-white/5 p-4 rounded-sm font-mono text-[10px] text-white/30 space-y-2">
              <p className="flex justify-between"><span>PROTOCOL</span> <span>SSL_ENCRYPTED</span></p>
              <p className="flex justify-between"><span>LOCATION</span> <span>UNRESOLVED_PROXY</span></p>
              <p className="flex justify-between"><span>ACCESS_LEVEL</span> <span className="text-[#ff00ff]">LEVEL_7_CLEARED</span></p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 text-[10px] font-mono text-red-400 flex items-center gap-2">
                <Lock size={12} /> {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full skew-button bg-[#00f3ff] text-black hover:bg-white shadow-[0_0_15px_#00f3ff] disabled:opacity-50"
            >
              <span className="skew-button-label flex items-center justify-center gap-3">
                <Globe size={18} />
                {loading ? 'AUTHENTICATING...' : 'LOGIN_WITH_GOOGLE'}
              </span>
            </motion.button>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="w-full h-px bg-white/10" />
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="text-[8px] font-mono text-white/20 uppercase">Core_Modules_Live</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#00f3ff] rotate-45" />
                <span className="text-[8px] font-mono text-white/20 uppercase">System_Verified</span>
              </div>
            </div>
            <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest">
              Authorized Personnel Only // v4.0.0
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-[#00f3ff]/20" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-[#ff00ff]/20" />
    </div>
  );
}

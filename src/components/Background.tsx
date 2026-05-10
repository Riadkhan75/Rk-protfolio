import MatrixRain from './MatrixRain';
import HudBrackets from './HudBrackets';

export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Scanlines */}
      <div className="scanlines" />

      {/* Perspective Grid */}
      <div className="perspective-grid" />
      
      {/* HUD Brackets */}
      <HudBrackets />

      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f3ff]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff00ff]/10 rounded-full blur-[120px] animate-pulse" />
      
      {/* Matrix Rain */}
      <MatrixRain />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%]" />
    </div>
  );
}

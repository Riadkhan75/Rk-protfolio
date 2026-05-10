import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '../context/AppContext';

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { matrixEnabled, neonMode, bgText, primaryColor, matrixSpeed, fontStyle } = useSettings();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', resize);
    resize();

    const chars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');
    const fontSize = 14;
    const columns = Math.ceil(window.innerWidth / fontSize);
    const drops: number[] = new Array(columns).fill(1).map(() => Math.random() * -100);

    // High Quality Particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
    }
    let particles: Particle[] = [];

    const draw = (time: number) => {
      // Dark trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Matrix Rain (Background Layer)
      if (matrixEnabled) {
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          if (Math.random() > 0.985) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = neonMode ? primaryColor : '#ff00ff';
            ctx.fillStyle = '#fff';
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = neonMode 
              ? (i % 2 === 0 ? `${primaryColor}26` : 'rgba(255, 0, 255, 0.1)') 
              : `${primaryColor}1a`;
            ctx.fillText(text, x, y);
          }

          if (y > window.innerHeight && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += matrixSpeed || 0.75;
        }
      }

      // 2. Large Background Text Overlay (Middle Layer)
      ctx.save();
      ctx.font = `900 12vw "${fontStyle || 'Inter'}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = neonMode ? `${primaryColor}08` : 'rgba(255, 0, 255, 0.03)';
      ctx.lineWidth = 2;
      
      // Floating movement
      const offX = Math.sin(time / 2000) * 20;
      const offY = Math.cos(time / 2500) * 20;
      
      ctx.strokeText(bgText || 'RK_HACKER', window.innerWidth / 2 + offX, window.innerHeight / 2 + offY);
      
      // Subtle Glow for the big text
      if (neonMode) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = `${primaryColor}0D`;
        ctx.strokeText(bgText || 'RK_HACKER', window.innerWidth / 2 + offX, window.innerHeight / 2 + offY);
      }
      ctx.restore();

      // 3. High Fidelity Particles (Foreground Layer)
      if (Math.random() > 0.4 && particles.length < 150) {
        particles.push({
          x: mousePos.x + (Math.random() - 0.5) * 80,
          y: mousePos.y + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2.5 + 0.5,
          color: neonMode ? (Math.random() > 0.5 ? primaryColor : '#ff00ff') : primaryColor,
          life: 1.0
        });
      }

      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        if (neonMode) {
          ctx.shadowBlur = 10 * p.life;
          ctx.shadowColor = p.color;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        return p.life > 0;
      });

      // 4. Mouse Electricity / Lightning
      if (Math.random() > 0.85) {
        ctx.save();
        ctx.strokeStyle = neonMode ? primaryColor : '#ff00ff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.strokeStyle;
        
        ctx.beginPath();
        let lx = mousePos.x;
        let ly = mousePos.y;
        ctx.moveTo(lx, ly);
        for(let j=0; j<4; j++) {
           lx += (Math.random() - 0.5) * 80;
           ly += (Math.random() - 0.5) * 80;
           ctx.lineTo(lx, ly);
        }
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [matrixEnabled, neonMode, mousePos, bgText, primaryColor, matrixSpeed, fontStyle]);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-black pointer-events-none" style={{ fontFamily: fontStyle || 'Inter' }}>
       {/* High performance grid overlay */}
       <div 
         className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" 
         style={{ '--grid-color': `${primaryColor}0D` } as any}
       />
       
       <canvas
         ref={canvasRef}
         className="w-full h-full"
       />

       {/* Vignette */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

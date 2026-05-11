import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      <motion.div
        className="w-8 h-8 rounded-full border border-primary-neon flex items-center justify-center mix-blend-difference"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          opacity: isVisible ? 1 : 0
        }}
      >
        <div className="w-1 h-1 bg-primary-neon rounded-full" />
        
        {/* Animated outer ring */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border border-primary-neon/30 rounded-full"
        />
        
        {/* Crosshair markers */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary-neon/50" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary-neon/50" />
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-[1px] bg-primary-neon/50" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-[1px] bg-primary-neon/50" />
      </motion.div>
    </div>
  );
}

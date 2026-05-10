import React, { createContext, useContext } from 'react';
import { useSoundEngine } from '../lib/sounds';
import { useSettings } from './AppContext';
import { cn } from '../lib/utils';

const SoundContext = createContext<ReturnType<typeof useSoundEngine> | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const { ambientMusicUrl } = useSettings();
  const soundEngine = useSoundEngine(ambientMusicUrl);
  return (
    <SoundContext.Provider value={soundEngine}>
      {children}
      {/* Hidden YouTube Player for background ambient */}
      {soundEngine.isYoutube && (
        <div className={cn(
          "fixed -top-full -left-full opacity-0 pointer-events-none",
          soundEngine.isMuted && "hidden"
        )}>
          {!soundEngine.isMuted && (
            <iframe 
              width="64" 
              height="64" 
              src={`https://www.youtube.com/embed/${soundEngine.youtubeId}?autoplay=1&loop=1&playlist=${soundEngine.youtubeId}&controls=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&widget_referrer=${encodeURIComponent(window.location.origin)}&mute=0`} 
              title="Ambient Audio Node"
              className="pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </div>
      )}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
}

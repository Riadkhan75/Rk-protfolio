import { useEffect, useRef, useState } from 'react';

const AMBIENT_URL = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'; // Low-fi cyberpunk ambient
const CLICK_SOUND = 'https://assets.mixkit.co/sfx/preview/mixkit-tech-break-602.mp3';
const HOVER_SOUND = 'https://assets.mixkit.co/sfx/preview/mixkit-interface-click-1126.mp3';

export function useSoundEngine(ambientUrl: string = AMBIENT_URL) {
  const [isMuted, setIsMuted] = useState(true);
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    // Enhanced regex for video ID extraction from various YouTube URL formats (watch, embed, share, shorts)
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };

  const youtubeId = getYoutubeId(ambientUrl);
  const isYoutube = !!youtubeId;

  useEffect(() => {
    if (isYoutube && youtubeId) {
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current = null;
      }
      return;
    }

    if (!ambientUrl) return;

    // Create a new Audio object only if URL changes
    const audio = new Audio(ambientUrl);
    audio.loop = true;
    audio.volume = 0.4;
    ambientRef.current = audio;

    // Handle initial play state
    if (!isMuted) {
      audio.play().catch(() => console.log('Autoplay blocked initially'));
    }

    return () => {
      audio.pause();
      ambientRef.current = null;
    };
  }, [ambientUrl, isYoutube, youtubeId]);

  // Handle Mute/Unmute separately to avoid recreating the Audio object
  useEffect(() => {
    if (isYoutube && youtubeId || !ambientRef.current) return;

    if (!isMuted) {
      ambientRef.current.play().catch(() => console.log('Autoplay blocked on state change'));
    } else {
      ambientRef.current.pause();
    }
  }, [isMuted, isYoutube]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    if (!isYoutube && ambientRef.current) {
      if (!nextMuted) {
        ambientRef.current.play().catch(() => console.log('Autoplay blocked'));
      } else {
        ambientRef.current.pause();
      }
    }
    setIsMuted(nextMuted);
  };

  const playClick = () => {
    if (isMuted) return;
    const sfx = new Audio(CLICK_SOUND);
    sfx.volume = 0.4;
    sfx.play().catch(() => {});
  };

  const playHover = () => {
    if (isMuted) return;
    const sfx = new Audio(HOVER_SOUND);
    sfx.volume = 0.1;
    sfx.play().catch(() => {});
  };

  return { isMuted, toggleMute, playClick, playHover, youtubeId, isYoutube };
}

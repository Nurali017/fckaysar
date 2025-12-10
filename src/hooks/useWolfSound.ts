import { useState, useCallback, useRef, useEffect } from 'react';

const WOLF_HOWL_URL = '/audio/wolf-howl.mp3';

export const useWolfSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize audio on mount
  useEffect(() => {
    const audio = new Audio(WOLF_HOWL_URL);
    audio.preload = 'auto';
    // iOS Safari compatibility
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');

    audio.addEventListener('canplaythrough', () => {
      setIsReady(true);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('error', () => {
      console.warn('Failed to load wolf howl audio');
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current) return;

    // iOS Safari: load() must be called within user gesture if not preloaded
    if (!isReady) {
      audioRef.current.load();
    }

    // Reset and play
    audioRef.current.currentTime = 0;
    audioRef.current.volume = 0.7;
    audioRef.current.play().catch(e => {
      console.warn('Audio play failed:', e);
      setIsPlaying(false);
    });

    setIsPlaying(true);
  }, [isReady]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  return { play, stop, toggle, isPlaying, isReady };
};

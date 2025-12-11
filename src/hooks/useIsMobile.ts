import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // SSR safety: default to true to avoid flash
    if (typeof window === 'undefined') return true;
    return window.innerWidth < 768 || /iPhone|iPad|iPod/.test(navigator.userAgent);
  });

  useEffect(() => {
    const check = () => {
      const isSmallScreen = window.innerWidth < 768;
      const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent);
      setIsMobile(isSmallScreen || isIOSSafari);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};

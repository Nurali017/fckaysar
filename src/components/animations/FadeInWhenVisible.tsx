import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface FadeInWhenVisibleProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
}

export const FadeInWhenVisible = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  threshold = 0.3,
}: FadeInWhenVisibleProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверяем iOS Safari где whileInView может не работать
    const checkMobile = () => {
      const isIOSSafari =
        /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isIOSSafari || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: isMobile ? 0.05 : threshold }}
      transition={{
        duration: isMobile ? 0.3 : duration,
        delay: isMobile ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

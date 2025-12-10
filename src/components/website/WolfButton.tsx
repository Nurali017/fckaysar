import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronUp } from 'lucide-react';
import { useWolfSound } from '@/hooks/useWolfSound';

export const WolfButton = () => {
  const { toggle, isPlaying } = useWolfSound();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll-to-top button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-zinc-800/90 hover:bg-zinc-700 border border-white/10 flex items-center justify-center shadow-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Wolf Sound Button */}
      <motion.button
        onClick={toggle}
        onTouchEnd={e => {
          // iOS Safari: explicit touch handler for better compatibility
          e.preventDefault();
          toggle();
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isPlaying
            ? 'bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.6)]'
            : 'bg-zinc-800/90 hover:bg-zinc-700 border border-white/10'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
        transition={isPlaying ? { repeat: Infinity, duration: 0.8 } : {}}
        aria-label={isPlaying ? 'Stop wolf sound' : 'Play wolf sound'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
            >
              <VolumeX className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="stopped"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
            >
              <Volume2 className="w-6 h-6 text-red-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TalentRecommendationModal } from './TalentRecommendationModal';

// Видео стадиона с дрона (Main ~15MB)
const STADIUM_VIDEO = '/videos/hero-main.mp4';

export const HeroSlider = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // Фото остается ярким до середины скролла, потом плавно исчезает
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div
      ref={ref}
      className="relative min-h-screen h-[var(--vh-fallback,100vh)] w-full overflow-hidden"
    >
      {/* Background Media */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          poster="/images/hero-poster.jpg"
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src={STADIUM_VIDEO} type="video/mp4" />
        </video>
      </motion.div>

      {/* Gradient Overlays - Victory Style (Акцент на фото) */}
      <motion.div style={{ opacity }} className="absolute inset-0">
        {/* Very subtle overall tint - чтобы фото было сочным, но не темным */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Left gradient - строгий фокус ТОЛЬКО под текстом */}
        {/* "via-transparent" сдвинут ближе к началу, чтобы быстрее открыть фото */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 via-40% to-transparent" />

        {/* Bottom fading - короткий, чтобы не закрывать низ фото */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-transparent" />

        {/* Золотистое/Красное торжественное свечение сверху (опционально) */}
        {/* Добавляет "воздуха" и праздничности */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.05)_0%,transparent_50%)]" />
      </motion.div>

      {/* Diagonal Lines Pattern - subtle texture */}
      <div className="absolute inset-0 bg-diagonal-lines opacity-25 pointer-events-none" />

      {/* Speed Lines - динамичные акценты */}
      <div className="absolute right-0 top-1/3 space-y-3 hidden lg:block">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 160 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="h-0.5 bg-gradient-to-l from-red-600 to-transparent"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 100 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="h-0.5 bg-gradient-to-l from-red-600/50 to-transparent ml-8"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ delay: 1.9, duration: 0.8 }}
          className="h-0.5 bg-gradient-to-l from-red-600/30 to-transparent ml-16"
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-20 sm:pt-24 md:pt-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl space-y-3 sm:space-y-4 md:space-y-6"
        >
          {/* Badge */}
          <motion.span
            variants={itemVariants}
            className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-red-600 text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase shadow-red-glow"
          >
            {t('hero.officialSite')}
          </motion.span>

          {/* Main Title - АГРЕССИВНАЯ ТИПОГРАФИКА */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(2rem,8vw,7rem)] font-black italic uppercase leading-[0.85] tracking-[-0.03em] sm:tracking-[-0.04em]"
          >
            <span className="block text-white drop-shadow-2xl">{t('hero.newEra')}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
              {t('hero.teamName')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xl leading-relaxed pr-4"
          >
            {t('hero.newOwner')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6 lg:pt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 md:px-10 h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide w-full sm:w-auto shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] transition-all duration-300"
                onClick={() => navigate('/club')}
              >
                {t('hero.aboutClub')}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-500/60 border-2 text-white hover:bg-yellow-500/20 px-6 sm:px-8 md:px-10 h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide w-full sm:w-auto backdrop-blur-sm group"
                onClick={() => setIsModalOpen(true)}
              >
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500 group-hover:text-yellow-400" />
                {t('talentRecommendation.cta', 'Ұсыну')}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/50 hidden sm:flex"
      >
        <motion.div
          animate={{ height: [0, 48, 0], y: [0, 0, 48] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px bg-gradient-to-b from-red-500/50 to-transparent"
        />
      </motion.div>

      {/* Bottom gradient transition to next section - softer */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent pointer-events-none" />

      {/* Talent Recommendation Modal */}
      <TalentRecommendationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

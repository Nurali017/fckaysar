import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Loader2 } from 'lucide-react';
import { useFeaturedNews } from '@/hooks/api/useNews';

export const HeroSlider = () => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch featured news for slider
  const { data: news = [], isLoading } = useFeaturedNews(5);

  // Auto-rotate slides
  useEffect(() => {
    if (news.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % news.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [news.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(
      i18n.language === 'en' ? 'en-US' : i18n.language === 'ru' ? 'ru-RU' : 'kk-KZ',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    ).format(date);
  };

  if (isLoading) {
    return (
      <section className="relative h-screen w-full bg-[hsl(222,47%,11%)] overflow-hidden flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="relative h-screen w-full bg-[hsl(222,47%,11%)] overflow-hidden flex items-center justify-center">
        <div className="text-white/50 font-mono">No news available</div>
      </section>
    );
  }

  const currentNews = news[currentSlide];

  return (
    <section className="relative h-screen w-full bg-[hsl(222,47%,11%)] overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[hsl(222,47%,11%)]" />

      {/* Background Image Slider — photo on the right */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNews.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-y-0 right-0 w-full md:w-[60%]"
        >
          <img
            src={currentNews.imageUrl}
            alt={currentNews.title}
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay: dark left fading to transparent right (desktop only) */}
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[hsl(222,47%,11%)] via-[hsl(222,47%,11%)]/60 to-transparent z-10" />
      {/* Bottom gradient for text area */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,11%)] via-transparent to-transparent opacity-80 z-10" />

      {/* Content Bottom Left */}
      <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-4 md:left-16 max-w-4xl z-20 pr-4">
        <div className="overflow-hidden">
          <motion.div
            key={`content-${currentNews.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Badge & Date */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="bg-red-600 text-white text-[10px] md:text-xs font-mono font-bold uppercase px-3 py-1 tracking-wider">
                {currentNews.category || 'News'}
              </span>
              <span className="text-white/70 font-mono text-xs md:text-sm border-l border-white/20 pl-3">
                {formatDate(currentNews.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <Link to={`/news/${currentNews.slug}`} className="group block">
              <h2 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.9] tracking-wide group-hover:text-red-500 transition-colors duration-300">
                {currentNews.title}
              </h2>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Pagination Bottom Left/Center */}
      <div className="absolute bottom-8 left-4 md:left-16 flex gap-2 z-20">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 md:w-16 bg-red-600'
                : 'w-6 md:w-8 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Calendar Link Bottom Right */}
      <Link
        to="/matches"
        className="absolute bottom-8 right-4 md:right-16 text-white group flex items-center gap-3 z-20"
      >
        <div className="hidden md:flex items-center gap-2">
          <span className="font-mono text-sm uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
            {t('hero.goToCalendar', 'Go to Calendar')}
          </span>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 flex items-center justify-center rounded-none group-hover:bg-red-500 transition-colors">
          <CalendarDays className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </Link>

      {/* Decorative: subtle vignette on photo edge */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-10" />
    </section>
  );
};

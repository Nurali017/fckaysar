import { motion } from 'framer-motion';
import { ArrowLeft, Share2, MapPin, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import type { MatchDetails } from '@/api/types/match-details-types';

interface MatchHeroProps {
  match: MatchDetails;
}

export const MatchHero = ({ match }: MatchHeroProps) => {
  const { t } = useTranslation();

  const handleShare = async () => {
    const shareData = {
      title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      text: `${match.homeTeam.name} ${match.homeTeam.score ?? ''} - ${match.awayTeam.score ?? ''} ${match.awayTeam.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <section className="relative min-h-[50vh] overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${match.homeTeam.brandColor}30 0%, transparent 40%, transparent 60%, ${match.awayTeam.brandColor}30 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      {/* Mesh Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('match.backToMatches', 'Все матчи')}
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('match.share', 'Поделиться')}
          </Button>
        </div>

        {/* Match Info Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex-wrap justify-center">
            <span className="flex items-center gap-2 text-sm text-gray-300">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {match.competition}
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4" />
              {match.stadium}
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4" />
              {match.date}
            </span>
          </div>
        </motion.div>

        {/* Teams and Score */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Home Team */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex flex-col items-center text-center"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              src={
                match.homeTeam.logo ||
                `https://placehold.co/128x128/1f1f1f/888?text=${match.homeTeam.shortName || match.homeTeam.name.substring(0, 3)}`
              }
              alt={match.homeTeam.name}
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              onError={e => {
                e.currentTarget.src = `https://placehold.co/128x128/1f1f1f/888?text=${match.homeTeam.shortName || match.homeTeam.name.substring(0, 3)}`;
                e.currentTarget.onerror = null;
              }}
            />
            <h2 className="mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
              {match.homeTeam.name}
            </h2>
            <span className="text-sm text-gray-400 mt-1">{t('match.home', 'Дома')}</span>
          </motion.div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            {match.status === 'finished' || match.status === 'live' ? (
              <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-4xl sm:text-6xl md:text-8xl font-black text-white tabular-nums"
                >
                  {match.homeTeam.score ?? 0}
                </motion.span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/30">:</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-4xl sm:text-6xl md:text-8xl font-black text-white tabular-nums"
                >
                  {match.awayTeam.score ?? 0}
                </motion.span>
              </div>
            ) : (
              <div className="text-4xl md:text-6xl font-black text-white/30">VS</div>
            )}

            {/* Status Badge */}
            <div className="mt-4">
              {match.status === 'live' ? (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-bold animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  LIVE
                </span>
              ) : match.status === 'finished' ? (
                <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold">
                  {t('match.status.ft', 'ЗАВЕРШЁН')}
                </span>
              ) : (
                <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold">
                  {t('match.status.upcoming', 'СКОРО')}
                </span>
              )}
            </div>
          </motion.div>

          {/* Away Team */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex flex-col items-center text-center"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              src={
                match.awayTeam.logo ||
                `https://placehold.co/128x128/1f1f1f/888?text=${match.awayTeam.shortName || match.awayTeam.name.substring(0, 3)}`
              }
              alt={match.awayTeam.name}
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              onError={e => {
                e.currentTarget.src = `https://placehold.co/128x128/1f1f1f/888?text=${match.awayTeam.shortName || match.awayTeam.name.substring(0, 3)}`;
                e.currentTarget.onerror = null;
              }}
            />
            <h2 className="mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
              {match.awayTeam.name}
            </h2>
            <span className="text-sm text-gray-400 mt-1">{t('match.away', 'В гостях')}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

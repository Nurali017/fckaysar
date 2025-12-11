import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { useUpcomingMatches } from '@/hooks/api/useGames';
import { useCurrentSeason, useNextSeason } from '@/hooks/api/useSeasons';
import { useTeamStatsWithForm } from '@/hooks/api/useTeamStats';
import { useIsMobile } from '@/hooks/useIsMobile';

// Memoized countdown item to prevent re-renders
const CountdownItem = memo(({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center bg-zinc-900/80 border border-white/5 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6 backdrop-blur-sm group hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(220,38,38,0.2)]">
    <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white tabular-nums mb-1 sm:mb-2 group-hover:text-red-500 transition-colors duration-300">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 font-bold group-hover:text-zinc-300 transition-colors">
      {label}
    </span>
  </div>
));
CountdownItem.displayName = 'CountdownItem';

// Memoized stat bar to prevent re-renders
const StatBar = memo(
  ({
    label,
    leftValue,
    rightValue,
    isMobile,
  }: {
    label: string;
    leftValue: number;
    rightValue: number;
    isMobile: boolean;
  }) => (
    <div className="space-y-1 sm:space-y-2">
      <div className="flex justify-between text-xs sm:text-sm font-bold">
        <span>{leftValue}%</span>
        <span className="text-gray-400 uppercase text-[10px] sm:text-xs tracking-widest">
          {label}
        </span>
        <span>{rightValue}%</span>
      </div>
      <div className="flex h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={isMobile ? { width: `${leftValue}%` } : { width: 0 }}
          animate={{ width: `${leftValue}%` }}
          transition={{ duration: isMobile ? 0 : 1, ease: 'easeOut' }}
          className="bg-red-600 h-full"
        />
        <motion.div
          initial={isMobile ? { width: `${rightValue}%` } : { width: 0 }}
          animate={{ width: `${rightValue}%` }}
          transition={{ duration: isMobile ? 0 : 1, ease: 'easeOut', delay: isMobile ? 0 : 0.2 }}
          className="bg-white h-full ml-auto"
        />
      </div>
    </div>
  )
);
StatBar.displayName = 'StatBar';

// Reusable countdown hook
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

// Countdown timer component using the hook
const CountdownTimer = memo(({ targetDate }: { targetDate: Date }) => {
  const { t } = useTranslation();
  const timeLeft = useCountdown(targetDate);

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4">
      <CountdownItem value={timeLeft.days} label={t('matches.countdown.days')} />
      <CountdownItem value={timeLeft.hours} label={t('matches.countdown.hours')} />
      <CountdownItem value={timeLeft.minutes} label={t('matches.countdown.minutes')} />
      <CountdownItem value={timeLeft.seconds} label={t('matches.countdown.seconds')} />
    </div>
  );
});
CountdownTimer.displayName = 'CountdownTimer';

export const MatchCenter = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live'>('upcoming');

  // Tab change handler
  const handleTabChange = useCallback((tab: 'upcoming' | 'live') => {
    setActiveTab(tab);
  }, []);

  // Get FC Kaisar's upcoming matches from API
  const kaisarTeamId = Number(import.meta.env.VITE_FC_KAISAR_TEAM_ID);
  const { data: upcomingMatches = [], isLoading, error } = useUpcomingMatches(kaisarTeamId, 1);

  // Get seasons and team stats for offseason display
  const { data: currentSeason, isLoading: currentSeasonLoading } = useCurrentSeason();
  const { data: nextSeason, isLoading: nextSeasonLoading } = useNextSeason();
  const { data: teamStats, isLoading: statsLoading } = useTeamStatsWithForm();

  const nextMatch = upcomingMatches[0];

  // Calculate dynamic years from season dates
  const currentYear = currentSeason ? new Date(currentSeason.endDate).getFullYear() : 2025;

  // Memoize next match date calculation
  const nextMatchDate = useMemo(() => {
    if (nextMatch?.date) {
      return new Date(nextMatch.date + ' ' + (nextMatch.time || '19:00'));
    }
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d;
  }, [nextMatch?.date, nextMatch?.time]);

  // Use countdown hook for timer
  const timeLeft = useCountdown(nextMatchDate);

  // Loading state - wait for all data
  if (isLoading || currentSeasonLoading || nextSeasonLoading || statsLoading) {
    return (
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12">
          <Skeleton className="h-48 sm:h-64 w-full bg-white/10" />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-white text-sm sm:text-base">
              Unable to load match data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // No matches state - Show Season Summary & Countdown to next season
  if (!nextMatch) {
    // Get target date from next season or fallback to default
    const nextSeasonDate = nextSeason
      ? new Date(nextSeason.startDate)
      : new Date('2026-03-01T00:00:00');

    return (
      <section className="relative overflow-hidden bg-zinc-900/70">
        {/* Grid Pattern Background - subtle */}
        <div className="absolute inset-0 bg-grid-subtle bg-grid-60 opacity-20" />

        {/* Corner Glow - very subtle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.05),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.03),transparent_70%)]" />

        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <motion.div
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0 : 0.3 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4"
              >
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                {t('matches.offseason')}
              </motion.div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 uppercase italic tracking-tighter">
                {t('matches.seasonSummary')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                  {currentYear}
                </span>
              </h2>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-center shadow-2xl relative overflow-hidden group/card">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full pointer-events-none group-hover/card:bg-red-600/20 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center relative z-10">
                {/* Previous Season Summary */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">
                    {t('matches.seasonSummary')}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                      {currentYear}
                    </span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-zinc-900/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(220,38,38,0.3)] group/stat">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 group-hover/stat:text-red-500 transition-colors">
                        {teamStats?.raw.points || '--'}
                      </div>
                      <div className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-widest group-hover/stat:text-zinc-300">
                        {t('stats.labels.points')}
                      </div>
                    </div>
                    <div className="bg-zinc-900/80 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(220,38,38,0.3)] group/stat">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 group-hover/stat:text-red-500 transition-colors">
                        {teamStats?.raw.games_played || 0}
                      </div>
                      <div className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-widest group-hover/stat:text-zinc-300">
                        {t('matches.games')}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 border-t border-b border-white/5 text-zinc-400">
                    <span className="flex flex-col md:flex-row gap-1 items-center">
                      <span>{t('matches.wins')}:</span>
                      <span className="text-white font-bold text-base sm:text-lg">
                        {teamStats?.raw.win || 0}
                      </span>
                    </span>
                    <span className="w-px h-6 sm:h-8 bg-white/10 mx-1 sm:mx-2" />
                    <span className="flex flex-col md:flex-row gap-1 items-center">
                      <span>{t('matches.draws')}:</span>
                      <span className="text-white font-bold text-base sm:text-lg">
                        {teamStats?.raw.draw || 0}
                      </span>
                    </span>
                    <span className="w-px h-6 sm:h-8 bg-white/10 mx-1 sm:mx-2" />
                    <span className="flex flex-col md:flex-row gap-1 items-center">
                      <span>{t('matches.losses')}:</span>
                      <span className="text-white font-bold text-base sm:text-lg">
                        {teamStats?.raw.match_loss || 0}
                      </span>
                    </span>
                  </div>

                  <Link to="/statistics" className="block w-full">
                    <Button className="w-full bg-gradient-to-r from-red-900/20 to-zinc-900 hover:from-red-900/40 hover:to-zinc-800 text-white border border-red-500/20 hover:border-red-500/50 py-4 sm:py-6 text-base sm:text-lg font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-900/20 min-h-[48px]">
                      {t('matches.fullStats')}
                    </Button>
                  </Link>
                </div>

                {/* Countdown to next season */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8 relative md:border-l md:border-white/5 md:pl-8 lg:pl-12 pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">
                    {t('matches.untilSeasonStart')}
                  </h3>
                  <CountdownTimer targetDate={nextSeasonDate} />
                  <p className="text-zinc-500 text-xs sm:text-sm font-medium uppercase tracking-wide">
                    {t('matches.firstMatchScheduled')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-zinc-900/70">
      {/* Grid Pattern Background - subtle */}
      <div className="absolute inset-0 bg-grid-subtle bg-grid-60 opacity-20" />

      {/* Corner Glow - very subtle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.05),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.03),transparent_70%)]" />

      {/* Night Stadium Background (very subtle) */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="/images/stadium/stadium-night.jpg"
          alt=""
          className="w-full h-full object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-zinc-900/80" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.3 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4"
          >
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
            Match Center
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 uppercase italic tracking-tighter">
            Next{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              Battle
            </span>
          </h2>
        </div>

        {/* Main Card */}
        <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          {/* Header / Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => handleTabChange('upcoming')}
              className={`flex-1 py-4 sm:py-6 text-center text-sm sm:text-base font-bold uppercase tracking-wider transition-all min-h-[48px] ${activeTab === 'upcoming' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleTabChange('live')}
              className={`flex-1 py-4 sm:py-6 text-center text-sm sm:text-base font-bold uppercase tracking-wider transition-all min-h-[48px] ${activeTab === 'live' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              Live Stats
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <AnimatePresence mode="wait">
              {activeTab === 'upcoming' ? (
                <motion.div
                  key="upcoming"
                  initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: isMobile ? 0 : 0.3 }}
                  className="flex flex-col items-center"
                >
                  {/* Teams */}
                  <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
                    <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
                      <img
                        src={nextMatch.homeTeam.logo}
                        alt={nextMatch.homeTeam.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      />
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-tighter text-center">
                        {nextMatch.homeTeam.name}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white/20">
                        VS
                      </span>
                      <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-center">{nextMatch.stadium}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
                      <img
                        src={nextMatch.awayTeam.logo}
                        alt={nextMatch.awayTeam.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      />
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-tighter text-center">
                        {nextMatch.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 w-full max-w-2xl">
                    <CountdownItem value={timeLeft.days} label={t('matches.countdown.days')} />
                    <CountdownItem value={timeLeft.hours} label={t('matches.countdown.hours')} />
                    <CountdownItem
                      value={timeLeft.minutes}
                      label={t('matches.countdown.minutes')}
                    />
                    <CountdownItem
                      value={timeLeft.seconds}
                      label={t('matches.countdown.seconds')}
                    />
                  </div>

                  <div className="text-center text-gray-400 text-xs sm:text-sm">
                    {nextMatch.date} • {nextMatch.time || '19:00'}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="live"
                  initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: isMobile ? 0 : 0.3 }}
                  className="space-y-4 sm:space-y-6 md:space-y-8"
                >
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
                    <span>Live Match Simulation</span>
                    <span className="flex items-center gap-1 sm:gap-2 text-red-500 font-bold animate-pulse">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      LIVE 67'
                    </span>
                  </div>

                  <StatBar label="Possession" leftValue={45} rightValue={55} isMobile={isMobile} />
                  <StatBar
                    label="Shots on Target"
                    leftValue={60}
                    rightValue={40}
                    isMobile={isMobile}
                  />
                  <StatBar
                    label="Pass Accuracy"
                    leftValue={82}
                    rightValue={78}
                    isMobile={isMobile}
                  />
                  <StatBar label="Fouls" leftValue={30} rightValue={70} isMobile={isMobile} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8">
                    <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10">
                      <h4 className="text-gray-400 text-xs sm:text-sm mb-2">Key Player</h4>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-sm sm:text-base truncate">Islam Chesnokov</p>
                          <p className="text-xs text-red-500">1 Goal, 1 Assist</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10">
                      <h4 className="text-gray-400 text-xs sm:text-sm mb-2">Momentum</h4>
                      <div className="flex items-center gap-2 text-green-500">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-bold text-sm sm:text-base">High Pressure</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUpcomingMatches, useFinishedMatches } from '@/hooks/api/useGames';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, differenceInDays } from 'date-fns';
import { kk, ru, enUS } from 'date-fns/locale';
import type { Match } from '@/types';

const getDateLocale = (lang: string) => {
  switch (lang) {
    case 'kk':
      return kk;
    case 'ru':
      return ru;
    default:
      return enUS;
  }
};

export const MatchSlider = () => {
  const { t, i18n } = useTranslation();
  const kaisarTeamId = Number(import.meta.env.VITE_FC_KAISAR_TEAM_ID);
  const { data: upcoming = [], isLoading: loadingUpcoming } = useUpcomingMatches(kaisarTeamId, 10);
  const { data: finished = [], isLoading: loadingFinished } = useFinishedMatches(kaisarTeamId, 10);
  const isLoading = loadingUpcoming || loadingFinished;
  const matches = upcoming.length > 0 ? upcoming : finished;
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCount = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 3;
  const maxIndex = Math.max(0, matches.length - visibleCount);

  const prev = useCallback(() => setCurrentIndex(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setCurrentIndex(i => Math.min(maxIndex, i + 1)), [maxIndex]);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && matches.length > 0) {
      initializedRef.current = true;
      setCurrentIndex(maxIndex);
    } else if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex, matches.length]);

  if (isLoading) {
    return (
      <section className="bg-[#111118] border-t border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="flex-1 h-64 bg-white/5 rounded-none" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (matches.length === 0) return null;

  return (
    <section className="bg-[#111118] border-t border-b border-white/10 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">
            {matches[0]?.league}
          </span>
          <Link
            to="/matches"
            className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-mono flex items-center gap-1"
          >
            {t('hero.goToCalendar', 'ПЕРЕЙТИ В КАЛЕНДАРЬ')}
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Slider */}
        <div className="relative flex items-stretch">
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/80 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Cards */}
          <div className="flex-1 overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {matches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  lang={i18n.language}
                  visibleCount={visibleCount}
                />
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          {currentIndex < maxIndex && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/80 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

const MatchCard = ({
  match,
  lang,
  visibleCount,
}: {
  match: Match;
  lang: string;
  visibleCount: number;
}) => {
  const { t } = useTranslation();
  const dateLocale = getDateLocale(lang);

  const rawDate = match.rawDate ? parseISO(match.rawDate) : null;
  const formattedDate = rawDate
    ? format(rawDate, 'dd.MM, HH:mm', { locale: dateLocale })
    : match.date;
  const daysUntil = rawDate ? Math.max(0, differenceInDays(rawDate, new Date())) : null;
  const isFinished = match.status === 'finished';

  return (
    <div
      className="flex-shrink-0 border-r border-white/10 last:border-r-0 p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4"
      style={{ width: `${100 / visibleCount}%` }}
    >
      {/* Tour & League */}
      <div className="flex items-center justify-between w-full text-xs text-gray-400 uppercase tracking-wider">
        <span>{match.tour ? `${match.tour} ${t('match.overview.tour', 'ТУР')}` : ''}</span>
        <span>{match.league}</span>
      </div>

      {/* Date & Venue */}
      <div className="text-center">
        <div className="text-base sm:text-lg font-bold text-white">{formattedDate}</div>
        <div className="text-xs text-gray-500">{match.stadium}</div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 w-full">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <img
            src={match.homeTeam.logo}
            alt={match.homeTeam.name}
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
            onError={e => (e.currentTarget.src = '/images/teams/placeholder-team.svg')}
          />
          <span className="text-xs font-bold text-center uppercase leading-tight">
            «{match.homeTeam.name}»
          </span>
        </div>

        {/* Score or Countdown */}
        {isFinished ? (
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              {t('matches.matchScore', 'СЧЕТ МАТЧА')}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl md:text-3xl font-black text-white bg-red-700 px-2 sm:px-3 py-1">
                {match.homeTeam.score ?? 0}
              </span>
              <span className="text-2xl md:text-3xl font-black text-white bg-white/10 px-2 sm:px-3 py-1">
                {match.awayTeam.score ?? 0}
              </span>
            </div>
          </div>
        ) : daysUntil !== null ? (
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              {t('matches.countdown.untilMatch', 'ДО МАТЧА')}
            </div>
            <div className="text-3xl md:text-4xl font-black text-white tabular-nums">
              {daysUntil}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {daysUntil === 1
                ? t('matches.countdown.day', 'ДЕНЬ')
                : t('matches.countdown.days', 'ДНЕЙ')}
            </div>
          </div>
        ) : null}

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <img
            src={match.awayTeam.logo}
            alt={match.awayTeam.name}
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
            onError={e => (e.currentTarget.src = '/images/teams/placeholder-team.svg')}
          />
          <span className="text-xs font-bold text-center uppercase leading-tight">
            «{match.awayTeam.name}»
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 w-full mt-auto">
        <Link
          to={`/match/${match.id}`}
          className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
        >
          {t('matches.matchCenter', 'МАТЧ-ЦЕНТР')}
        </Link>
      </div>
    </div>
  );
};

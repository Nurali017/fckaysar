import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/website/PageWrapper';
import { useTeamMatches } from '@/hooks/api/useGames';
import { useTranslation } from 'react-i18next';

type FilterType = 'all' | 'finished' | 'upcoming';

const KAYSAR_TEAM_ID = 94;

const MatchesPage = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('all');
  const { data: matches = [], isLoading, error } = useTeamMatches(KAYSAR_TEAM_ID);

  // Filter matches based on selected filter
  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('matches.filterAll', 'All Matches') },
    { key: 'finished', label: t('matches.filterResults', 'Results') },
    { key: 'upcoming', label: t('matches.filterUpcoming', 'Upcoming') },
  ];

  return (
    <PageWrapper>
      <SEO title="Матчи" description="Расписание и результаты матчей ФК Кайсар" path="/matches" />
      <main className="bg-[hsl(222,47%,11%)] min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-red-500 hover:text-white mb-4 transition-colors font-mono text-xs uppercase tracking-wider"
              >
                <ChevronLeft className="w-3 h-3" /> {t('common.back', 'Back')}
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-2 leading-none">
                {t('matches.title', 'Matches')}{' '}
                <span className="text-red-600">{t('matches.season', '2025')}</span>
              </h1>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map(item => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`px-4 py-2 text-sm font-mono uppercase tracking-wider transition-all border ${
                    filter === item.key
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-transparent border-white/20 text-white/60 hover:border-white hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center text-center text-white/60 gap-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <p>{t('common.errorLoad', 'Failed to load matches')}</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="py-20 text-center text-white/40 font-mono">
              {t('matches.noMatches', 'No matches found')}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMatches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
};

interface Match {
  id: string;
  homeTeam: { name: string; logo: string; score?: number };
  awayTeam: { name: string; logo: string; score?: number };
  date: string;
  time: string;
  stadium: string;
  league: string;
  status: 'upcoming' | 'live' | 'finished';
}

const MatchCard = ({ match, index }: { match: Match; index: number }) => {
  const isKaysarHome =
    match.homeTeam.name.toLowerCase().includes('kaisar') ||
    match.homeTeam.name.toLowerCase().includes('кайсар');
  const isFinished = match.status === 'finished';
  const homeScore = match.homeTeam.score ?? 0;
  const awayScore = match.awayTeam.score ?? 0;

  let result: 'win' | 'draw' | 'loss' | null = null;
  if (isFinished) {
    if (isKaysarHome) {
      result = homeScore > awayScore ? 'win' : homeScore < awayScore ? 'loss' : 'draw';
    } else {
      result = awayScore > homeScore ? 'win' : awayScore < homeScore ? 'loss' : 'draw';
    }
  }

  const resultColor = {
    win: 'bg-green-500',
    loss: 'bg-red-500',
    draw: 'bg-gray-500',
  };

  return (
    <Link to={`/match/${match.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative bg-white/5 border border-white/5 hover:border-red-600/50 transition-all flex flex-col md:flex-row items-center p-4 md:p-6 gap-6"
      >
        {/* Status Indicator Line */}
        {result && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 ${resultColor[result]} md:w-1 w-full md:h-full h-1`}
          />
        )}

        {/* Date & Meta */}
        <div className="md:w-32 flex-shrink-0 text-center md:text-left">
          <div className="font-mono text-white/60 text-xs uppercase mb-1">{match.date}</div>
          <div className="font-mono text-white/40 text-[10px] uppercase">{match.stadium}</div>
        </div>

        {/* Matchup */}
        <div className="flex-1 flex items-center justify-between w-full md:w-auto gap-4">
          {/* Home Team */}
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
            <span
              className={`font-display uppercase text-sm sm:text-lg md:text-2xl text-right ${isKaysarHome ? 'text-white' : 'text-white/60'}`}
            >
              {match.homeTeam.name}
            </span>
            <img
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* Score / Time */}
          <div className="w-16 sm:w-20 md:w-24 flex-shrink-0 text-center">
            {isFinished ? (
              <div className="bg-white/10 py-1 px-3">
                <span className="font-display text-2xl md:text-3xl text-white tracking-widest">
                  {homeScore}:{awayScore}
                </span>
              </div>
            ) : (
              <div className="border border-red-600 py-1 px-2">
                <span className="font-mono text-red-500 text-lg font-bold">{match.time}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex items-center justify-start gap-3 md:gap-4">
            <img
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
            <span
              className={`font-display uppercase text-sm sm:text-lg md:text-2xl text-left ${!isKaysarHome ? 'text-white' : 'text-white/60'}`}
            >
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Mobile Result Label */}
        {result && (
          <div className="md:hidden absolute top-2 right-2">
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2 py-1 ${result === 'win' ? 'text-green-500 bg-green-500/10' : result === 'loss' ? 'text-red-500 bg-red-500/10' : 'text-gray-400 bg-gray-500/10'}`}
            >
              {result}
            </span>
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default MatchesPage;

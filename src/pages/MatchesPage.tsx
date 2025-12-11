import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Filter, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/website/PageWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useTeamMatches } from '@/hooks/api/useGames';
import { useIsMobile } from '@/hooks/useIsMobile';

type FilterType = 'all' | 'finished' | 'upcoming';

const KAYSAR_TEAM_ID = 94;

const MatchesPage = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const { data: matches = [], isLoading } = useTeamMatches(KAYSAR_TEAM_ID);
  const isMobile = useIsMobile();

  // Filter matches based on selected filter
  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-b from-red-900/20 to-black">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <Calendar className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
              All <span className="text-red-500">Matches</span>
            </h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'finished', 'upcoming'] as FilterType[]).map(type => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                onClick={() => setFilter(type)}
                className={`capitalize ${
                  filter === type
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-transparent border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {type === 'all' ? 'All Matches' : type === 'finished' ? 'Results' : 'Upcoming'}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Matches List */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-24 w-full bg-white/10 rounded-xl" />
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No matches found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} isMobile={isMobile} />
            ))}
          </div>
        )}
      </section>
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

const MatchCard = ({
  match,
  index,
  isMobile,
}: {
  match: Match;
  index: number;
  isMobile: boolean;
}) => {
  const isKaysarHome =
    match.homeTeam.name.includes('Кайсар') ||
    match.homeTeam.name.includes('Kaysar') ||
    match.homeTeam.name.includes('Kaisar');

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

  const resultColors = {
    win: 'border-l-green-500 bg-green-500/5',
    draw: 'border-l-gray-500 bg-gray-500/5',
    loss: 'border-l-red-500 bg-red-500/5',
  };

  return (
    <Link to={`/match/${match.id}`}>
      <motion.div
        initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isMobile ? 0 : index * 0.05 }}
        className={`border-l-4 ${result ? resultColors[result] : 'border-l-blue-500 bg-blue-500/5'}
                    backdrop-blur-sm rounded-r-xl p-4 md:p-6 hover:bg-white/5 transition-all cursor-pointer`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Date & Competition */}
          <div className="sm:w-32 flex-shrink-0">
            <p className="text-sm font-bold text-gray-400">{match.date}</p>
            <p className="text-xs text-gray-500">{match.stadium}</p>
          </div>

          {/* Teams */}
          <div className="flex-1 flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-1">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                onError={e => (e.currentTarget.src = '/images/teams/placeholder-team.svg')}
              />
              <span
                className={`font-bold text-sm md:text-base truncate ${
                  isKaysarHome ? 'text-red-500' : 'text-white'
                }`}
              >
                {match.homeTeam.name}
              </span>
            </div>

            {/* Score */}
            <div className="flex-shrink-0 text-center px-4">
              {isFinished ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl md:text-3xl font-black ${
                      isKaysarHome && result === 'win'
                        ? 'text-green-500'
                        : isKaysarHome && result === 'loss'
                          ? 'text-red-500'
                          : 'text-white'
                    }`}
                  >
                    {homeScore}
                  </span>
                  <span className="text-gray-500">:</span>
                  <span
                    className={`text-2xl md:text-3xl font-black ${
                      !isKaysarHome && result === 'win'
                        ? 'text-green-500'
                        : !isKaysarHome && result === 'loss'
                          ? 'text-red-500'
                          : 'text-white'
                    }`}
                  >
                    {awayScore}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-blue-500">{match.time}</span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <span
                className={`font-bold text-sm md:text-base truncate text-right ${
                  !isKaysarHome ? 'text-red-500' : 'text-white'
                }`}
              >
                {match.awayTeam.name}
              </span>
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                onError={e => (e.currentTarget.src = '/images/teams/placeholder-team.svg')}
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="md:w-24 flex-shrink-0 text-right">
            {isFinished ? (
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  result === 'win'
                    ? 'bg-green-500/20 text-green-500'
                    : result === 'loss'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {result === 'win' ? 'WIN' : result === 'loss' ? 'LOSS' : 'DRAW'}
              </span>
            ) : (
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-500">
                UPCOMING
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MatchesPage;

import { Calendar, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Match } from '@/types';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUpcomingMatches, useFinishedMatches } from '@/hooks/api/useGames';
import { useIsMobile } from '@/hooks/useIsMobile';

export const MatchesSection = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Get FC Kaisar team ID from environment
  const kaisarTeamId = Number(import.meta.env.VITE_FC_KAISAR_TEAM_ID);

  // Fetch upcoming and finished matches
  const {
    data: upcomingMatches = [],
    isLoading: isLoadingUpcoming,
    error: errorUpcoming,
  } = useUpcomingMatches(kaisarTeamId, 5);

  const {
    data: finishedMatches = [],
    isLoading: isLoadingFinished,
    error: errorFinished,
  } = useFinishedMatches(kaisarTeamId, 5);

  const isLoading = isLoadingUpcoming || isLoadingFinished;
  const hasError = errorUpcoming || errorFinished;

  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent to-black/30">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t('matches.title')}</h2>
        <p className="text-gray-400 text-lg">{t('matches.subtitle')}</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-5xl mx-auto space-y-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <Skeleton className="h-24 w-full bg-white/10" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="max-w-5xl mx-auto">
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-white">
              {t('matches.error', 'Unable to load matches. Please try again later.')}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Tabs */}
      {!isLoading && !hasError && (
        <Tabs defaultValue="upcoming" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-red-600">
              {t('matches.upcoming')} ({upcomingMatches.length})
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-red-600">
              {t('matches.results')} ({finishedMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} isMobile={isMobile} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                {t('matches.noUpcoming', 'No upcoming matches scheduled')}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {finishedMatches.length > 0 ? (
              finishedMatches.map((match, index) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  index={index}
                  isResult
                  isMobile={isMobile}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                {t('matches.noResults', 'No match results available')}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8">
          {t('matches.viewAll')}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

interface MatchCardProps {
  match: Match;
  index: number;
  isResult?: boolean;
  isMobile: boolean;
}

const MatchCard = ({ match, index, isResult = false, isMobile }: MatchCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: isMobile ? 0 : index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono uppercase">
          {match.status === 'live' && (
            <span className="flex items-center gap-2 text-red-500 font-bold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {t('matches.live')}
            </span>
          )}
          {!isResult && index === 0 && match.status !== 'live' && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {t('matches.nextGame')}
            </span>
          )}
          {match.league}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          {match.date}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:gap-6 md:gap-8 mb-4">
        {/* Home Team */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          <img
            src={match.homeTeam.logo}
            alt={match.homeTeam.name}
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
          <span className="font-bold text-lg md:text-xl uppercase">{match.homeTeam.name}</span>
        </div>

        {/* Score/Time */}
        <div className="flex flex-col items-center gap-1">
          {isResult && match.homeTeam.score !== undefined ? (
            <div className="text-3xl md:text-4xl font-black">
              {match.homeTeam.score} : {match.awayTeam.score}
            </div>
          ) : (
            <>
              <span className="text-2xl md:text-3xl font-black text-white/20">
                {t('matches.vs')}
              </span>
              <span className="text-xl md:text-2xl font-bold text-white">{match.time}</span>
            </>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
          <span className="font-bold text-lg md:text-xl uppercase">{match.awayTeam.name}</span>
          <img
            src={match.awayTeam.logo}
            alt={match.awayTeam.name}
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4 text-red-500" />
          {match.stadium}
        </div>
        {!isResult && (
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold">
            {t('matches.buyTicket')}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

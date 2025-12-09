import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useLeagueStandings } from '@/hooks/api/useStandings';

const KAYSAR_TEAM_ID = 94;
const VISIBLE_TEAMS_COUNT = 5;

interface TeamStats {
  rank: number;
  teamId: number;
  name: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

export const LeagueTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get league standings from API
  const { data: apiStandings = [], isLoading, error } = useLeagueStandings();

  // Transform API standings to TeamStats format
  const leagueData: TeamStats[] = useMemo(
    () =>
      apiStandings.map(standing => ({
        rank: standing.rank,
        teamId: standing.teamId,
        name: standing.teamName,
        logo: standing.logo,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        points: standing.points,
      })),
    [apiStandings]
  );

  // Get visible teams - either all or 5 teams with Kaysar in the middle
  const visibleTeams = useMemo(() => {
    if (isExpanded || leagueData.length <= VISIBLE_TEAMS_COUNT) {
      return leagueData;
    }

    // Find Kaysar's position
    const kaysarIndex = leagueData.findIndex(team => team.teamId === KAYSAR_TEAM_ID);

    if (kaysarIndex === -1) {
      // Kaysar not found, show top 5
      return leagueData.slice(0, VISIBLE_TEAMS_COUNT);
    }

    // Calculate start index to center Kaysar (2 teams above, 2 below)
    const halfVisible = Math.floor(VISIBLE_TEAMS_COUNT / 2);
    let startIndex = kaysarIndex - halfVisible;

    // Adjust if at the start
    if (startIndex < 0) {
      startIndex = 0;
    }

    // Adjust if at the end
    if (startIndex + VISIBLE_TEAMS_COUNT > leagueData.length) {
      startIndex = leagueData.length - VISIBLE_TEAMS_COUNT;
    }

    return leagueData.slice(startIndex, startIndex + VISIBLE_TEAMS_COUNT);
  }, [leagueData, isExpanded]);

  // Loading state
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 sm:gap-3 uppercase italic tracking-tighter">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            {t('league.title')}
          </h2>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
          <Skeleton className="h-48 sm:h-64 w-full bg-white/10" />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container mx-auto px-4 py-10 sm:py-12">
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-white text-sm sm:text-base">
            {t('league.error')}
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  // No data state
  if (leagueData.length === 0) {
    return (
      <section className="container mx-auto px-4 py-10 sm:py-12">
        <div className="text-center text-gray-400 text-sm sm:text-base">{t('league.noData')}</div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 sm:py-12">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 sm:gap-3 uppercase italic tracking-tighter">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            {t('league.title')}
          </span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-[40px] sm:w-[60px] text-center text-gray-400 font-bold text-xs sm:text-sm">
                  #
                </TableHead>
                <TableHead className="text-gray-400 font-bold text-xs sm:text-sm min-w-[120px]">
                  {t('league.table.club')}
                </TableHead>
                <TableHead className="text-center text-gray-400 font-bold text-xs sm:text-sm">
                  {t('league.table.played')}
                </TableHead>
                <TableHead className="text-center text-gray-400 font-bold text-xs sm:text-sm">
                  {t('league.table.won')}
                </TableHead>
                <TableHead className="text-center text-gray-400 font-bold text-xs sm:text-sm">
                  {t('league.table.drawn')}
                </TableHead>
                <TableHead className="text-center text-gray-400 font-bold text-xs sm:text-sm">
                  {t('league.table.lost')}
                </TableHead>
                <TableHead className="text-center text-white font-black text-sm sm:text-lg">
                  {t('league.table.points')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {visibleTeams.map(team => {
                  const isKaysar = team.teamId === KAYSAR_TEAM_ID;
                  const isTopThree = team.rank <= 3;
                  return (
                    <motion.tr
                      key={team.teamId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={isKaysar ? () => navigate('/statistics') : undefined}
                      className={`border-white/5 transition-colors ${isKaysar ? 'bg-red-600/20 hover:bg-red-600/30 cursor-pointer' : 'hover:bg-white/5'}`}
                    >
                      <TableCell className="font-bold text-center text-gray-300">
                        {isTopThree ? (
                          <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto text-xs">
                            {team.rank}
                          </div>
                        ) : (
                          team.rank
                        )}
                      </TableCell>
                      <TableCell>
                        {isKaysar ? (
                          <Link to="/statistics" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full p-1.5 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600/20 transition-colors">
                              <img
                                src={team.logo}
                                alt={team.name}
                                className="w-full h-full object-contain"
                                onError={e => {
                                  e.currentTarget.src = `https://placehold.co/40x40/1f1f1f/888?text=${team.name.substring(0, 2)}`;
                                  e.currentTarget.onerror = null;
                                }}
                              />
                            </div>
                            <span className="font-bold uppercase tracking-wide text-sm md:text-base truncate text-red-500 group-hover:text-red-400 transition-colors">
                              {team.name}
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full p-1.5 flex items-center justify-center flex-shrink-0">
                              <img
                                src={team.logo}
                                alt={team.name}
                                className="w-full h-full object-contain"
                                onError={e => {
                                  e.currentTarget.src = `https://placehold.co/40x40/1f1f1f/888?text=${team.name.substring(0, 2)}`;
                                  e.currentTarget.onerror = null;
                                }}
                              />
                            </div>
                            <span className="font-bold uppercase tracking-wide text-sm md:text-base truncate text-white">
                              {team.name}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-gray-400 font-mono text-xs sm:text-sm">
                        {team.played}
                      </TableCell>
                      <TableCell className="text-center text-gray-400 font-mono text-xs sm:text-sm">
                        {team.won}
                      </TableCell>
                      <TableCell className="text-center text-gray-400 font-mono text-xs sm:text-sm">
                        {team.drawn}
                      </TableCell>
                      <TableCell className="text-center text-gray-400 font-mono text-xs sm:text-sm">
                        {team.lost}
                      </TableCell>
                      <TableCell className="text-center font-black text-base sm:text-xl text-white">
                        {team.points}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Expand/Collapse Button */}
        {leagueData.length > VISIBLE_TEAMS_COUNT && (
          <div className="border-t border-white/10 p-3 sm:p-4">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-gray-400 hover:text-white hover:bg-white/5 min-h-[44px] text-sm sm:text-base"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  {t('league.showLess')}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  {t('league.showAll')} {leagueData.length} {t('league.teams')}
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  );
};

import { motion } from 'framer-motion';
import { Activity, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSotaPlayerStats } from '@/hooks/api/useSotaPlayers';
import {
  calculateRadarStats,
  calculateMatchRating,
  calculateDerivedStats,
  getPlayerForm,
  getPositionKey,
} from '@/lib/player-stats-calculator';
import { PlayerRadarChart } from '@/components/stats/PlayerRadarChart';
import { PlayerStatsGrid } from '@/components/stats/PlayerStatsGrid';
import { PerGameStats } from '@/components/stats/PerGameStats';
import { DisciplineCard } from '@/components/stats/DisciplineCard';
import { GoalkeeperStats } from '@/components/stats/GoalkeeperStats';
import type { PlayerStats } from '@/types/player';

interface PlayerProfileProps {
  playerId: string;
  initialData?: any;
}

export const PlayerProfile = ({ playerId, initialData }: PlayerProfileProps) => {
  const { t } = useTranslation();
  const { data: statsResponse, isLoading } = useSotaPlayerStats(playerId);

  // Get full statistics from API response (включая V2 данные для радарной диаграммы)
  const fullStats: PlayerStats = {
    appearances: statsResponse?.data.stats.find((s) => s.key === 'games_played')?.value ?? initialData?.stats?.appearances ?? 0,
    goals: statsResponse?.data.stats.find((s) => s.key === 'goal')?.value ?? initialData?.stats?.goals ?? 0,
    assists: statsResponse?.data.stats.find((s) => s.key === 'goal_pass')?.value ?? initialData?.stats?.assists ?? 0,
    yellowCards: statsResponse?.data.stats.find((s) => s.key === 'yellow_cards')?.value ?? initialData?.stats?.yellowCards ?? 0,
    redCards: statsResponse?.data.stats.find((s) => s.key === 'red_cards')?.value ?? initialData?.stats?.redCards ?? 0,
    cleanSheets: statsResponse?.data.stats.find((s) => s.key === 'clean_sheet')?.value ?? initialData?.stats?.cleanSheets ?? 0,
    minutesPlayed: statsResponse?.data.stats.find((s) => s.key === 'time_on_field_total')?.value ?? initialData?.stats?.minutesPlayed ?? 0,
    // V2 данные для радарной диаграммы
    shots: initialData?.stats?.shots ?? 0,
    shotsOnGoal: initialData?.stats?.shotsOnGoal ?? 0,
    passes: initialData?.stats?.passes ?? 0,
    duels: initialData?.stats?.duels ?? 0,
    tackles: initialData?.stats?.tackles ?? 0,
  };

  // Player basic data
  const player = {
    firstName: initialData?.firstName || statsResponse?.data.first_name || '',
    lastName: initialData?.lastName || statsResponse?.data.last_name || '',
    number: initialData?.number || 0,
    position: initialData?.position || '',
    nationality: initialData?.nationality || '',
    image: initialData?.photoUrl || initialData?.image,
  };

  // Get position key for calculations
  const positionKey = initialData?.positionKey || getPositionKey(player.position);

  // Calculate all metrics using real data
  const radarData = calculateRadarStats(fullStats);
  const matchRating = calculateMatchRating(fullStats, positionKey);
  const derivedStats = calculateDerivedStats(fullStats);
  const formData = getPlayerForm(fullStats);

  // Loading state
  if (isLoading && !initialData) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">

        {/* LEFT COLUMN - Hero Section (2/5 width) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Player Name */}
          <div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              {player.firstName}
            </h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-red-600 uppercase tracking-tighter leading-none">
              {player.lastName}
            </h2>
          </div>

          {/* Player Meta */}
          <div className="flex items-center gap-3 text-base md:text-lg text-gray-300 font-medium">
            <span className="text-white font-bold">#{player.number}</span>
            <span className="text-gray-500">•</span>
            <span>{player.position}</span>
            <span className="text-gray-500">•</span>
            <span>{player.nationality}</span>
          </div>

          {/* Player Image */}
          <motion.div
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative w-full aspect-square max-w-[300px]"
          >
            {player.image ? (
              <img
                src={player.image}
                alt={`${player.firstName} ${player.lastName}`}
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
                onError={(e) => {
                  // Hide image on error and show initials fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            {/* Fallback - always render, but image will overlay it if loaded successfully */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center border border-white/10 absolute inset-0" style={{ zIndex: player.image ? -1 : 0 }}>
              <span className="text-6xl md:text-7xl font-black text-gray-700">
                {player.firstName[0]}
                {player.lastName[0]}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN - Stats Dashboard (3/5 width) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3"
        >
          <div className="space-y-6 md:space-y-8">

            {/* Header with In Form badge */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                {t('playerStats.seasonStats')}
              </h3>
              {formData.form === 'hot' && (
                <span className="px-3 md:px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase border border-green-500/30">
                  {t('playerStats.inForm')} 🔥
                </span>
              )}
            </div>

            {/* Main Stats Grid */}
            <PlayerStatsGrid
              goals={fullStats.goals}
              assists={fullStats.assists}
              matches={fullStats.appearances}
              rating={matchRating}
            />

            {/* Per Game Stats */}
            <PerGameStats
              goalsPerGame={derivedStats.goalsPerGame}
              assistsPerGame={derivedStats.assistsPerGame}
              minutesPerGame={derivedStats.minutesPerGame}
            />

            {/* Radar Chart / Goalkeeper Stats */}
            {positionKey === 'goalkeeper' ? (
              <GoalkeeperStats
                cleanSheets={fullStats.cleanSheets}
                appearances={fullStats.appearances}
                minutesPlayed={fullStats.minutesPlayed}
              />
            ) : (
              <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h4 className="text-lg font-bold text-white mb-4">{t('playerStats.playerAttributes')}</h4>
                <PlayerRadarChart
                  data={radarData}
                  playerName={`${player.firstName} ${player.lastName}`}
                />
              </div>
            )}

            {/* Discipline & Defense */}
            <DisciplineCard
              yellowCards={fullStats.yellowCards}
              redCards={fullStats.redCards}
              cleanSheets={fullStats.cleanSheets}
            />

          </div>
        </motion.div>

      </div>
    </section>
  );
};

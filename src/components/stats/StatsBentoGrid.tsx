/**
 * StatsBentoGrid - Bento-style grid layout for key statistics
 * Asymmetric grid with different card sizes (Apple/Man City style)
 */

import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Activity, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard } from './StatCard';
import { AnimatedCounter } from './AnimatedCounter';
import { WinRateRing, SeasonProgressRing } from './SeasonProgressRing';
import { cn } from '@/lib/utils';
import type { ProcessedTeamStats } from '@/api/types/team-stats-types';

interface StatsBentoGridProps {
  stats: ProcessedTeamStats;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const StatsBentoGrid = ({ stats, className }: StatsBentoGridProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5',
        'auto-rows-[120px] md:auto-rows-[160px]',
        className
      )}
    >
      {/* Large Card - Win Rate (spans 2 rows on desktop) */}
      <StatCard
        size="lg"
        variant="highlight"
        className="col-span-2 row-span-2 flex flex-col items-center justify-center"
        delay={0}
      >
        <WinRateRing
          wins={stats.raw.win}
          draws={stats.raw.draw}
          losses={stats.raw.match_loss}
          size="lg"
        />
        <div className="mt-4 flex items-center gap-6">
          <div className="text-center">
            <span className="text-xl md:text-2xl font-black text-green-500">{stats.raw.win}</span>
            <span className="block text-[10px] text-gray-400 uppercase">
              {t('stats.labels.wins')}
            </span>
          </div>
          <div className="text-center">
            <span className="text-xl md:text-2xl font-black text-yellow-500">{stats.raw.draw}</span>
            <span className="block text-[10px] text-gray-400 uppercase">
              {t('stats.labels.draws')}
            </span>
          </div>
          <div className="text-center">
            <span className="text-xl md:text-2xl font-black text-red-500">
              {stats.raw.match_loss}
            </span>
            <span className="block text-[10px] text-gray-400 uppercase">
              {t('stats.labels.losses')}
            </span>
          </div>
        </div>
      </StatCard>

      {/* Points Card */}
      <StatCard size="md" className="flex flex-col items-center justify-center" delay={1}>
        <div className="p-2.5 bg-yellow-500/10 mb-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <AnimatedCounter
          value={stats.raw.points}
          className="text-4xl md:text-5xl font-black text-white"
        />
        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">
          {t('stats.labels.points')}
        </span>
      </StatCard>

      {/* Goals Card */}
      <StatCard size="md" className="flex flex-col items-center justify-center" delay={2}>
        <div className="p-2.5 bg-green-500/10 mb-2">
          <Target className="w-5 h-5 text-green-500" />
        </div>
        <AnimatedCounter
          value={stats.raw.goals}
          className="text-4xl md:text-5xl font-black text-green-500"
        />
        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">
          {t('stats.labels.goals')}
        </span>
      </StatCard>

      {/* Goal Difference Card */}
      <StatCard size="md" className="flex flex-col items-center justify-center" delay={3}>
        <div className="p-2.5 bg-blue-500/10 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-400">
            {stats.raw.goals_difference >= 0 ? '+' : ''}
          </span>
          <AnimatedCounter
            value={Math.abs(stats.raw.goals_difference)}
            className={cn(
              'text-4xl md:text-5xl font-black',
              stats.raw.goals_difference >= 0 ? 'text-blue-500' : 'text-red-500'
            )}
          />
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-1">
          {t('stats.labels.goalDiff')}
        </span>
      </StatCard>

      {/* Season Progress Card */}
      <StatCard size="md" className="flex flex-col items-center justify-center" delay={4}>
        <SeasonProgressRing
          gamesPlayed={stats.raw.games_played}
          totalGames={stats.raw.games_total}
          size="sm"
          showLabel={false}
        />
        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mt-2">
          {t('stats.labels.season')}
        </span>
      </StatCard>
    </motion.div>
  );
};

// Alternative simpler grid for mobile
export const StatsBentoGridSimple = ({ stats, className }: StatsBentoGridProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('grid grid-cols-2 gap-3', className)}
    >
      {/* Points */}
      <StatCard size="md" className="text-center" delay={0}>
        <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
        <AnimatedCounter value={stats.raw.points} className="text-3xl font-black text-white" />
        <span className="text-xs text-gray-400 uppercase mt-1 block">
          {t('stats.labels.points')}
        </span>
      </StatCard>

      {/* Goals */}
      <StatCard size="md" className="text-center" delay={1}>
        <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <AnimatedCounter value={stats.raw.goals} className="text-3xl font-black text-green-500" />
        <span className="text-xs text-gray-400 uppercase mt-1 block">
          {t('stats.labels.goals')}
        </span>
      </StatCard>

      {/* Win Rate */}
      <StatCard size="md" className="text-center" delay={2}>
        <Percent className="w-6 h-6 text-red-500 mx-auto mb-2" />
        <AnimatedCounter
          value={stats.winRate}
          suffix="%"
          className="text-3xl font-black text-red-500"
        />
        <span className="text-xs text-gray-400 uppercase mt-1 block">
          {t('stats.labels.winRate')}
        </span>
      </StatCard>

      {/* Games */}
      <StatCard size="md" className="text-center" delay={3}>
        <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
        <span className="text-3xl font-black text-white">
          {stats.raw.games_played}/{stats.raw.games_total}
        </span>
        <span className="text-xs text-gray-400 uppercase mt-1 block">
          {t('stats.labels.matches')}
        </span>
      </StatCard>
    </motion.div>
  );
};

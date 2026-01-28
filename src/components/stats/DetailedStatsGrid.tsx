/**
 * DetailedStatsGrid - Tabbed grid for detailed statistics
 * Categories: Attack, Defense, Discipline, Attendance
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Swords,
  Shield,
  FileWarning,
  Users,
  Target,
  Crosshair,
  HandHelping,
  CornerDownRight,
  AlertTriangle,
  UserX,
  Ban,
  TrendingDown,
  Trophy,
  Percent,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from './StatCard';
import { cn } from '@/lib/utils';
import type { ProcessedTeamStats, StatCategory } from '@/api/types/team-stats-types';

interface DetailedStatsGridProps {
  stats: ProcessedTeamStats;
  className?: string;
}

const categoryIcons: Record<StatCategory, typeof Swords> = {
  attack: Swords,
  defense: Shield,
  discipline: FileWarning,
  attendance: Users,
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const DetailedStatsGrid = ({ stats, className }: DetailedStatsGridProps) => {
  const [activeTab, setActiveTab] = useState<StatCategory>('attack');
  const { t } = useTranslation();

  return (
    <div className={cn('w-full', className)}>
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as StatCategory)}>
        <TabsList className="w-full bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
          {(Object.keys(categoryIcons) as StatCategory[]).map(category => {
            const Icon = categoryIcons[category];

            return (
              <TabsTrigger
                key={category}
                value={category}
                className={cn(
                  'flex-1 gap-2 py-3 rounded-lg transition-all data-[state=active]:bg-white/10',
                  'data-[state=active]:text-white text-gray-400'
                )}
              >
                <Icon className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t(`stats.categories.${category}`)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent key="attack" value="attack" className="mt-0">
            <AttackStats stats={stats} />
          </TabsContent>

          <TabsContent key="defense" value="defense" className="mt-0">
            <DefenseStats stats={stats} />
          </TabsContent>

          <TabsContent key="discipline" value="discipline" className="mt-0">
            <DisciplineStats stats={stats} />
          </TabsContent>

          <TabsContent key="attendance" value="attendance" className="mt-0">
            <AttendanceStats stats={stats} />
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

// Attack Statistics
const AttackStats = ({ stats }: { stats: ProcessedTeamStats }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Target className="w-5 h-5" />}
          label={t('stats.labels.goalsScored')}
          value={stats.raw.goals}
          color="green"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Target className="w-5 h-5" />}
          label={t('stats.labels.goalsPerGame')}
          value={stats.goalsPerGame}
          color="green"
          decimals={2}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Crosshair className="w-5 h-5" />}
          label={t('stats.labels.totalShots')}
          value={stats.raw.shots}
          color="white"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Crosshair className="w-5 h-5" />}
          label={t('stats.labels.shotsPerGame')}
          value={stats.shotsPerGame}
          color="white"
          decimals={1}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<HandHelping className="w-5 h-5" />}
          label={t('stats.labels.assists')}
          value={stats.raw.assists}
          color="blue"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<HandHelping className="w-5 h-5" />}
          label={t('stats.labels.assistsPerGame')}
          value={stats.assistsPerGame}
          color="blue"
          decimals={2}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<CornerDownRight className="w-5 h-5" />}
          label={t('stats.labels.corners')}
          value={stats.raw.corners}
          color="white"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Percent className="w-5 h-5" />}
          label={t('stats.labels.shotAccuracy')}
          value={stats.shotAccuracy}
          suffix="%"
          color="yellow"
        />
      </motion.div>
    </motion.div>
  );
};

// Defense Statistics
const DefenseStats = ({ stats }: { stats: ProcessedTeamStats }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      <motion.div variants={itemVariants}>
        <StatItem
          icon={<TrendingDown className="w-5 h-5" />}
          label={t('stats.labels.goalsConceded')}
          value={stats.raw.goals_conceded}
          color="red"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<TrendingDown className="w-5 h-5" />}
          label={t('stats.labels.concededPerGame')}
          value={stats.goalsConcededPerGame}
          color="red"
          decimals={2}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Shield className="w-5 h-5" />}
          label={t('stats.labels.cleanSheetRate')}
          value={stats.cleanSheetRate}
          suffix="%"
          color="blue"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Trophy className="w-5 h-5" />}
          label={t('stats.labels.goalDifference')}
          value={stats.raw.goals_difference}
          prefix={stats.raw.goals_difference >= 0 ? '+' : ''}
          color={stats.raw.goals_difference >= 0 ? 'green' : 'red'}
        />
      </motion.div>
    </motion.div>
  );
};

// Discipline Statistics
const DisciplineStats = ({ stats }: { stats: ProcessedTeamStats }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      <motion.div variants={itemVariants}>
        <StatItem
          icon={<AlertTriangle className="w-5 h-5" />}
          label={t('stats.labels.yellowCards')}
          value={stats.raw.yellow_cards}
          color="yellow"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<UserX className="w-5 h-5" />}
          label={t('stats.labels.redCards')}
          value={stats.raw.red_cards}
          color="red"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Ban className="w-5 h-5" />}
          label={t('stats.labels.fouls')}
          value={stats.raw.fouls}
          color="white"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Ban className="w-5 h-5" />}
          label={t('stats.labels.foulsPerGame')}
          value={stats.foulsPerGame}
          color="white"
          decimals={1}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<FileWarning className="w-5 h-5" />}
          label={t('stats.labels.cardsPerGame')}
          value={stats.cardsPerGame}
          color="yellow"
          decimals={1}
        />
      </motion.div>
    </motion.div>
  );
};

// Attendance Statistics
const AttendanceStats = ({ stats }: { stats: ProcessedTeamStats }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
    >
      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Users className="w-5 h-5" />}
          label={t('stats.labels.averageAttendance')}
          value={stats.raw.average_visitors}
          color="purple"
          formatNumber
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Users className="w-5 h-5" />}
          label={t('stats.labels.totalAttendance')}
          value={stats.raw.visitor_total}
          color="purple"
          formatNumber
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatItem
          icon={<Trophy className="w-5 h-5" />}
          label={t('stats.labels.homeGames')}
          value={Math.ceil(stats.raw.games_played / 2)}
          color="white"
        />
      </motion.div>
    </motion.div>
  );
};

// Individual stat item component
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'white';
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatNumber?: boolean;
}

const colorClasses = {
  green: 'text-green-500 bg-green-500/10',
  red: 'text-red-500 bg-red-500/10',
  yellow: 'text-yellow-500 bg-yellow-500/10',
  blue: 'text-blue-500 bg-blue-500/10',
  purple: 'text-purple-500 bg-purple-500/10',
  white: 'text-white bg-white/10',
};

const StatItem = ({
  icon,
  label,
  value,
  color = 'white',
  prefix = '',
  suffix = '',
  decimals = 0,
  formatNumber = false,
}: StatItemProps) => {
  const displayValue = formatNumber
    ? value.toLocaleString('ru-RU')
    : decimals > 0
      ? value.toFixed(decimals)
      : value;

  return (
    <StatCard size="md" className="h-full">
      <div className={cn('p-2 rounded-lg inline-flex mb-3', colorClasses[color].split(' ')[1])}>
        <span className={colorClasses[color].split(' ')[0]}>{icon}</span>
      </div>

      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-lg font-bold text-gray-400">{prefix}</span>}
        <span className={cn('text-3xl font-black tabular-nums', colorClasses[color].split(' ')[0])}>
          {displayValue}
        </span>
        {suffix && <span className="text-lg font-bold text-gray-400">{suffix}</span>}
      </div>

      <span className="block mt-1 text-xs text-gray-400 uppercase tracking-wider font-semibold">
        {label}
      </span>
    </StatCard>
  );
};

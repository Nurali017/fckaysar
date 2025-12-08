import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { TeamMatchStats } from '@/api/types/match-details-types';

interface MatchStatsProps {
  homeStats: TeamMatchStats;
  awayStats: TeamMatchStats;
  homeColor?: string;
  awayColor?: string;
}

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  homeColor: string;
  awayColor: string;
  format?: 'number' | 'percentage';
  index: number;
}

const StatBar = ({
  label,
  homeValue,
  awayValue,
  homeColor,
  awayColor,
  format = 'number',
  index,
}: StatBarProps) => {
  const total = homeValue + awayValue || 1;
  const homePercent = (homeValue / total) * 100;
  const awayPercent = (awayValue / total) * 100;

  const formatValue = (val: number) => {
    if (format === 'percentage') return `${val}%`;
    return val.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-white tabular-nums w-12 text-left">
          {formatValue(homeValue)}
        </span>
        <span className="text-gray-400 uppercase text-xs tracking-wider flex-1 text-center">
          {label}
        </span>
        <span className="font-bold text-white tabular-nums w-12 text-right">
          {formatValue(awayValue)}
        </span>
      </div>
      <div className="flex h-2 gap-1">
        <div className="flex-1 flex justify-end">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${homePercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + index * 0.1 }}
            style={{ backgroundColor: homeColor }}
            className="h-full rounded-l-full"
          />
        </div>
        <div className="flex-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${awayPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
            style={{ backgroundColor: awayColor }}
            className="h-full rounded-r-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export const MatchStats = ({
  homeStats,
  awayStats,
  homeColor = '#dc2626',
  awayColor = '#ffffff',
}: MatchStatsProps) => {
  const { t } = useTranslation();

  const stats: { key: keyof TeamMatchStats; label: string; format: 'number' | 'percentage' }[] = [
    { key: 'possession', label: t('match.stats.possession', 'Владение'), format: 'percentage' },
    { key: 'shot', label: t('match.stats.shots', 'Удары'), format: 'number' },
    { key: 'shots_on_goal', label: t('match.stats.shotsOnTarget', 'В створ'), format: 'number' },
    { key: 'shots_off_goal', label: t('match.stats.shotsOffTarget', 'Мимо'), format: 'number' },
    { key: 'pass', label: t('match.stats.passes', 'Передачи'), format: 'number' },
    { key: 'foul', label: t('match.stats.fouls', 'Фолы'), format: 'number' },
    { key: 'corner', label: t('match.stats.corners', 'Угловые'), format: 'number' },
    { key: 'offside', label: t('match.stats.offsides', 'Офсайды'), format: 'number' },
    { key: 'yellow_cards', label: t('match.stats.yellowCards', 'Жёлтые'), format: 'number' },
    { key: 'red_cards', label: t('match.stats.redCards', 'Красные'), format: 'number' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {stats.map((stat, index) => (
        <StatBar
          key={stat.key}
          label={stat.label}
          homeValue={homeStats[stat.key]}
          awayValue={awayStats[stat.key]}
          homeColor={homeColor}
          awayColor={awayColor}
          format={stat.format}
          index={index}
        />
      ))}
    </div>
  );
};

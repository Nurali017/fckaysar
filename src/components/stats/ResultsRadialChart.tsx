/**
 * ResultsRadialChart - Radial bar chart for match results visualization
 * Shows wins, draws, losses as stacked radial bars
 */

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { StatCard } from './StatCard';

interface ResultsRadialChartProps {
  wins: number;
  draws: number;
  losses: number;
  gamesPlayed: number;
  className?: string;
}

export const ResultsRadialChart = ({
  wins,
  draws,
  losses,
  gamesPlayed,
  className,
}: ResultsRadialChartProps) => {
  // Calculate percentages
  const winPercent = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
  const drawPercent = gamesPlayed > 0 ? Math.round((draws / gamesPlayed) * 100) : 0;
  const lossPercent = gamesPlayed > 0 ? Math.round((losses / gamesPlayed) * 100) : 0;

  const data = [
    {
      name: 'Wins',
      value: winPercent,
      count: wins,
      fill: '#16a34a',
    },
    {
      name: 'Draws',
      value: drawPercent,
      count: draws,
      fill: '#f59e0b',
    },
    {
      name: 'Losses',
      value: lossPercent,
      count: losses,
      fill: '#dc2626',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('h-[200px] md:h-[280px] w-full', className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="90%"
          barSize={18}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'rgba(255,255,255,0.05)' }}
            dataKey="value"
            cornerRadius={0}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Full card component with title and legend
interface MatchResultsCardProps {
  wins: number;
  draws: number;
  losses: number;
  gamesPlayed: number;
  className?: string;
}

export const MatchResultsCard = ({
  wins,
  draws,
  losses,
  gamesPlayed,
  className,
}: MatchResultsCardProps) => {
  const { t } = useTranslation();
  const winPercent = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
  const drawPercent = gamesPlayed > 0 ? Math.round((draws / gamesPlayed) * 100) : 0;
  const lossPercent = gamesPlayed > 0 ? Math.round((losses / gamesPlayed) * 100) : 0;

  return (
    <StatCard size="lg" className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{t('stats.labels.matchResults')}</h3>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
          {gamesPlayed} {t('stats.labels.games')}
        </span>
      </div>

      <ResultsRadialChart wins={wins} draws={draws} losses={losses} gamesPlayed={gamesPlayed} />

      {/* Legend */}
      <div className="mt-2 md:mt-4 flex justify-around">
        <LegendItem
          color="bg-green-500"
          label={t('stats.labels.wins')}
          value={wins}
          percent={winPercent}
        />
        <LegendItem
          color="bg-yellow-500"
          label={t('stats.labels.draws')}
          value={draws}
          percent={drawPercent}
        />
        <LegendItem
          color="bg-red-500"
          label={t('stats.labels.losses')}
          value={losses}
          percent={lossPercent}
        />
      </div>
    </StatCard>
  );
};

// Legend item component
interface LegendItemProps {
  color: string;
  label: string;
  value: number;
  percent: number;
}

const LegendItem = ({ color, label, value, percent }: LegendItemProps) => (
  <div className="text-center">
    <div className="flex items-center gap-2 justify-center mb-1">
      <div className={cn('w-3 h-3 rounded-full', color)} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
    <div className="text-xl font-black text-white">{value}</div>
    <div className="text-xs text-gray-500">{percent}%</div>
  </div>
);

// Simple horizontal results bar
interface ResultsBarProps {
  wins: number;
  draws: number;
  losses: number;
  className?: string;
}

export const ResultsBar = ({ wins, draws, losses, className }: ResultsBarProps) => {
  const total = wins + draws + losses;
  if (total === 0) return null;

  const winPercent = (wins / total) * 100;
  const drawPercent = (draws / total) * 100;
  const lossPercent = (losses / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={cn('space-y-2', className)}
    >
      <div className="h-4 flex rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${winPercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="bg-green-500"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${drawPercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="bg-yellow-500"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${lossPercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="bg-red-500"
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-green-500 font-bold">{wins}W</span>
        <span className="text-yellow-500 font-bold">{draws}D</span>
        <span className="text-red-500 font-bold">{losses}L</span>
      </div>
    </motion.div>
  );
};

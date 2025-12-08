/**
 * SeasonProgressRing - Circular progress indicator for season progress
 * Shows games played vs total games
 */

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SeasonProgressRingProps {
  gamesPlayed: number;
  totalGames: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-24 h-24',
    inner: 35,
    outer: 45,
    textSize: 'text-lg',
    labelSize: 'text-[8px]',
  },
  md: {
    container: 'w-32 h-32',
    inner: 45,
    outer: 58,
    textSize: 'text-2xl',
    labelSize: 'text-[10px]',
  },
  lg: {
    container: 'w-40 h-40',
    inner: 55,
    outer: 70,
    textSize: 'text-3xl',
    labelSize: 'text-xs',
  },
};

export const SeasonProgressRing = ({
  gamesPlayed,
  totalGames,
  size = 'md',
  showLabel = true,
  className,
}: SeasonProgressRingProps) => {
  const config = sizeConfig[size];
  const gamesRemaining = totalGames - gamesPlayed;

  const data = [
    { name: 'Played', value: gamesPlayed },
    { name: 'Remaining', value: gamesRemaining },
  ];

  const COLORS = ['#dc2626', 'rgba(255,255,255,0.1)'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('relative', config.container, className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={config.inner}
            outerRadius={config.outer}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            animationBegin={200}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
                strokeWidth={0}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={cn('font-black text-white', config.textSize)}
        >
          {gamesPlayed}/{totalGames}
        </motion.span>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={cn('text-gray-400 uppercase tracking-wider font-bold mt-0.5', config.labelSize)}
          >
            Matches
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

// Alternative style with percentage in center
interface PercentageRingProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PercentageRing = ({
  value,
  max = 100,
  label,
  color = '#dc2626',
  size = 'md',
  className,
}: PercentageRingProps) => {
  const config = sizeConfig[size];
  const percentage = Math.round((value / max) * 100);
  const remaining = max - value;

  const data = [
    { name: 'Value', value: value },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('relative', config.container, className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={config.inner}
            outerRadius={config.outer}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            animationBegin={200}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            <Cell fill={color} strokeWidth={0} />
            <Cell fill="rgba(255,255,255,0.1)" strokeWidth={0} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-black text-white', config.textSize)}>
          {percentage}%
        </span>
        {label && (
          <span className={cn('text-gray-400 uppercase tracking-wider font-bold mt-0.5', config.labelSize)}>
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Win Rate specific component
interface WinRateRingProps {
  wins: number;
  draws: number;
  losses: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WinRateRing = ({
  wins,
  draws,
  losses,
  size = 'lg',
  className,
}: WinRateRingProps) => {
  const config = sizeConfig[size];
  const total = wins + draws + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  const data = [
    { name: 'Wins', value: wins },
    { name: 'Draws', value: draws },
    { name: 'Losses', value: losses },
  ];

  const COLORS = ['#16a34a', '#f59e0b', '#dc2626'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('relative', config.container, className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={config.inner}
            outerRadius={config.outer}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            dataKey="value"
            animationBegin={200}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
                strokeWidth={0}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-black text-white', config.textSize)}>
          {winRate}%
        </span>
        <span className={cn('text-gray-400 uppercase tracking-wider font-bold mt-0.5', config.labelSize)}>
          Win Rate
        </span>
      </div>
    </motion.div>
  );
};

/**
 * GoalsBarChart - Horizontal bar chart for goals analysis
 * Shows goals scored, conceded, and difference
 */

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { StatCard } from './StatCard';
import { useIsMobile } from '@/hooks/useIsMobile';

interface GoalsBarChartProps {
  goalsScored: number;
  goalsConceded: number;
  className?: string;
}

export const GoalsBarChart = ({ goalsScored, goalsConceded, className }: GoalsBarChartProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const goalDifference = goalsScored - goalsConceded;

  const data = [
    {
      category: t('stats.labels.scored'),
      value: goalsScored,
      fill: '#16a34a', // green-600
    },
    {
      category: t('stats.labels.conceded'),
      value: goalsConceded,
      fill: '#dc2626', // red-600
    },
  ];

  return (
    <motion.div
      initial={isMobile ? { opacity: 1 } : { opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: isMobile ? 0 : 0.6 }}
      className={cn('h-[150px] md:h-[200px] w-full', className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 40, left: 0, bottom: 10 }}
          barCategoryGap={20}
        >
          <XAxis type="number" hide domain={[0, Math.max(goalsScored, goalsConceded) * 1.2]} />
          <YAxis
            type="category"
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 600 }}
            width={60}
          />
          <Bar
            dataKey="value"
            radius={[0, 0, 0, 0]}
            animationDuration={isMobile ? 0 : 1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              fill="#ffffff"
              fontSize={18}
              fontWeight={800}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Goal difference indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-gray-400 text-sm">{t('stats.labels.goalDifference')}:</span>
        <span
          className={cn(
            'text-xl font-black',
            goalDifference > 0 && 'text-green-500',
            goalDifference < 0 && 'text-red-500',
            goalDifference === 0 && 'text-gray-400'
          )}
        >
          {goalDifference > 0 ? '+' : ''}
          {goalDifference}
        </span>
      </div>
    </motion.div>
  );
};

// Full card component with title
interface GoalsAnalysisCardProps {
  goalsScored: number;
  goalsConceded: number;
  goalsPerGame: number;
  concededPerGame: number;
  className?: string;
}

export const GoalsAnalysisCard = ({
  goalsScored,
  goalsConceded,
  goalsPerGame,
  concededPerGame,
  className,
}: GoalsAnalysisCardProps) => {
  const { t } = useTranslation();

  return (
    <StatCard size="lg" className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{t('stats.labels.goalsAnalysis')}</h3>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">
          {t('stats.labels.seasonTotal')}
        </span>
      </div>

      <GoalsBarChart goalsScored={goalsScored} goalsConceded={goalsConceded} />

      {/* Per game stats */}
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-around">
        <div className="text-center">
          <span className="text-2xl font-black text-green-500">{goalsPerGame}</span>
          <span className="block text-xs text-gray-400">{t('stats.labels.goalsPerGame')}</span>
        </div>
        <div className="text-center">
          <span className="text-2xl font-black text-red-500">{concededPerGame}</span>
          <span className="block text-xs text-gray-400">{t('stats.labels.concededPerGame')}</span>
        </div>
      </div>
    </StatCard>
  );
};

// Comparison style bar chart
interface ComparisonBarChartProps {
  items: Array<{
    label: string;
    value: number;
    color: string;
    max?: number;
  }>;
  className?: string;
}

export const ComparisonBarChart = ({ items, className }: ComparisonBarChartProps) => {
  const isMobile = useIsMobile();
  const maxValue = Math.max(...items.map(i => i.max || i.value));

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;

        return (
          <motion.div
            key={item.label}
            initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: isMobile ? 0 : index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{item.label}</span>
              <span className="font-bold text-white">{item.value}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: isMobile ? `${percentage}%` : 0 }}
                whileInView={{ width: `${percentage}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: isMobile ? 0 : 1,
                  delay: isMobile ? 0 : 0.2 + index * 0.1,
                  ease: 'easeOut',
                }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

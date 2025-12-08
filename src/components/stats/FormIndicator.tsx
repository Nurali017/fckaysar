/**
 * FormIndicator - Visual indicator for last match results
 * Shows W/D/L as colored circles
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type MatchResult = 'W' | 'D' | 'L';

interface FormIndicatorProps {
  form: MatchResult[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    circle: 'w-6 h-6',
    text: 'text-xs',
    gap: 'gap-1.5',
  },
  md: {
    circle: 'w-8 h-8',
    text: 'text-sm',
    gap: 'gap-2',
  },
  lg: {
    circle: 'w-10 h-10',
    text: 'text-base',
    gap: 'gap-3',
  },
};

const resultConfig: Record<MatchResult, { bg: string; text: string; label: string }> = {
  W: {
    bg: 'bg-green-500',
    text: 'text-white',
    label: 'Win',
  },
  D: {
    bg: 'bg-yellow-500',
    text: 'text-black',
    label: 'Draw',
  },
  L: {
    bg: 'bg-red-500',
    text: 'text-white',
    label: 'Loss',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20,
    },
  },
};

export const FormIndicator = ({
  form,
  maxDisplay = 5,
  size = 'md',
  showLabels = false,
  className,
}: FormIndicatorProps) => {
  const config = sizeConfig[size];
  const displayForm = form.slice(0, maxDisplay);

  // Fill remaining slots with empty indicators if less than maxDisplay
  const emptySlots = maxDisplay - displayForm.length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('flex items-center', config.gap, className)}
    >
      {displayForm.map((result, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="flex flex-col items-center"
        >
          <div
            className={cn(
              config.circle,
              'rounded-full flex items-center justify-center font-bold shadow-lg',
              resultConfig[result].bg,
              resultConfig[result].text
            )}
          >
            <span className={config.text}>{result}</span>
          </div>
          {showLabels && (
            <span className="text-[10px] text-gray-500 mt-1 uppercase">
              {resultConfig[result].label}
            </span>
          )}
        </motion.div>
      ))}

      {/* Empty slots */}
      {Array.from({ length: emptySlots }).map((_, index) => (
        <motion.div
          key={`empty-${index}`}
          variants={itemVariants}
          className={cn(
            config.circle,
            'rounded-full flex items-center justify-center',
            'bg-white/10 border border-white/20'
          )}
        >
          <span className={cn(config.text, 'text-gray-500')}>-</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Compact horizontal form with legend
interface FormWithLegendProps {
  form: MatchResult[];
  className?: string;
}

export const FormWithLegend = ({ form, className }: FormWithLegendProps) => {
  const wins = form.filter(r => r === 'W').length;
  const draws = form.filter(r => r === 'D').length;
  const losses = form.filter(r => r === 'L').length;

  return (
    <div className={cn('space-y-4', className)}>
      <FormIndicator form={form} size="md" />

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400">{wins} wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-400">{draws} draws</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-400">{losses} losses</span>
        </div>
      </div>
    </div>
  );
};

// Streak indicator (consecutive results)
interface StreakIndicatorProps {
  form: MatchResult[];
  className?: string;
}

export const StreakIndicator = ({ form, className }: StreakIndicatorProps) => {
  if (form.length === 0) return null;

  // Calculate current streak
  const currentResult = form[0];
  let streakCount = 0;

  for (const result of form) {
    if (result === currentResult) {
      streakCount++;
    } else {
      break;
    }
  }

  const streakLabels: Record<MatchResult, string> = {
    W: 'winning',
    D: 'draw',
    L: 'losing',
  };

  const streakColors: Record<MatchResult, string> = {
    W: 'text-green-500',
    D: 'text-yellow-500',
    L: 'text-red-500',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-bold text-2xl', streakColors[currentResult])}>
        {streakCount}
      </span>
      <span className="text-gray-400 text-sm">
        game {streakLabels[currentResult]} streak
      </span>
    </div>
  );
};

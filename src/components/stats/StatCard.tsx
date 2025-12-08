/**
 * StatCard - Glassmorphism card component for statistics
 * Supports different sizes and hover effects with glow
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'highlight' | 'success' | 'danger' | 'warning';
  onClick?: () => void;
  delay?: number;
}

const sizeStyles = {
  sm: 'p-3 rounded-xl',
  md: 'p-4 md:p-5 rounded-2xl',
  lg: 'p-5 md:p-6 rounded-2xl md:rounded-3xl',
  xl: 'p-6 md:p-8 rounded-3xl',
};

const variantStyles = {
  default: 'border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]',
  highlight: 'border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]',
  success: 'border-green-500/30 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(22,163,74,0.15)]',
  danger: 'border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]',
  warning: 'border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: delay * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const StatCard = ({
  children,
  className,
  size = 'md',
  variant = 'default',
  onClick,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
      whileHover={{ scale: 1.02 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        // Base glassmorphism styles
        'bg-white/5 backdrop-blur-xl',
        'border',
        'shadow-xl',
        'transition-all duration-500',
        // Size
        sizeStyles[size],
        // Variant
        variantStyles[variant],
        // Interactive
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// Preset card for key statistics with icon and large number
interface KeyStatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  suffix?: string;
  prefix?: string;
  color?: 'red' | 'green' | 'yellow' | 'blue' | 'white';
  delay?: number;
}

const colorStyles = {
  red: 'text-red-500',
  green: 'text-green-500',
  yellow: 'text-yellow-500',
  blue: 'text-blue-500',
  white: 'text-white',
};

const iconBgStyles = {
  red: 'bg-red-500/10',
  green: 'bg-green-500/10',
  yellow: 'bg-yellow-500/10',
  blue: 'bg-blue-500/10',
  white: 'bg-white/10',
};

export const KeyStatCard = ({
  icon,
  value,
  label,
  suffix,
  prefix,
  color = 'white',
  delay = 0,
}: KeyStatCardProps) => {
  return (
    <StatCard size="md" delay={delay} className="text-center">
      {/* Icon */}
      <div className={cn(
        'mb-3 p-2.5 rounded-xl inline-flex mx-auto',
        iconBgStyles[color]
      )}>
        <div className={colorStyles[color]}>{icon}</div>
      </div>

      {/* Value */}
      <div className="flex items-baseline justify-center gap-1">
        {prefix && (
          <span className="text-xl font-bold text-gray-400">{prefix}</span>
        )}
        <span className={cn(
          'text-3xl md:text-4xl font-black tabular-nums',
          colorStyles[color]
        )}>
          {value}
        </span>
        {suffix && (
          <span className="text-lg font-bold text-gray-400">{suffix}</span>
        )}
      </div>

      {/* Label */}
      <span className="block mt-1 text-xs text-gray-400 uppercase tracking-wider font-bold">
        {label}
      </span>
    </StatCard>
  );
};

// Mini stat card for detailed grids
interface MiniStatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export const MiniStatCard = ({
  label,
  value,
  icon,
  trend,
  delay = 0,
}: MiniStatCardProps) => {
  return (
    <StatCard size="sm" delay={delay}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-gray-400">{icon}</div>
          )}
          <span className="text-xs text-gray-400 font-medium">{label}</span>
        </div>
        {trend && (
          <span className={cn(
            'text-xs',
            trend === 'up' && 'text-green-500',
            trend === 'down' && 'text-red-500',
            trend === 'neutral' && 'text-gray-500'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'}
          </span>
        )}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-black text-white tabular-nums">{value}</span>
      </div>
    </StatCard>
  );
};

import { motion } from 'framer-motion';
import { Trophy, Star, Circle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlayerStatsGridProps {
  goals: number;
  assists: number;
  matches: number;
  rating: number;
  onStatClick?: (statKey: string) => void;
}

interface StatCardProps {
  label: string;
  value: number;
  decimals?: number;
  icon: React.ReactNode;
  iconColor: string;
  statKey: string;
  onClick?: (statKey: string) => void;
  delay?: number;
}

const StatCard = ({
  label,
  value,
  decimals = 0,
  icon,
  iconColor,
  statKey,
  onClick,
  delay = 0,
}: StatCardProps) => (
  <motion.button
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{
      duration: 0.5,
      delay,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    }}
    whileHover={{
      scale: 1.05,
      boxShadow: '0 0 40px rgba(220,38,38,0.3)',
    }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick?.(statKey)}
    className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-5 md:p-6 flex flex-col items-center justify-center border border-white/5 hover:border-red-500/50 transition-all cursor-pointer group overflow-hidden"
  >
    {/* Background glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-transparent transition-all duration-300" />

    {/* Icon */}
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative mb-3 p-2.5 bg-white/5 group-hover:bg-white/10 rounded-full transition-colors"
    >
      <div className={iconColor}>{icon}</div>
    </motion.div>

    {/* Value */}
    <span className="relative text-3xl md:text-4xl font-black text-white">
      {decimals > 0 ? value.toFixed(decimals) : value}
    </span>

    {/* Label */}
    <span className="relative text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-bold mt-1 group-hover:text-gray-400 transition-colors">
      {label}
    </span>

    {/* Click indicator */}
    {onClick && (
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      </div>
    )}
  </motion.button>
);

export const PlayerStatsGrid = ({
  goals,
  assists,
  matches,
  rating,
  onStatClick,
}: PlayerStatsGridProps) => {
  const { t } = useTranslation();

  // Container animation
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
    >
      <StatCard
        label={t('playerStats.goals')}
        value={goals}
        icon={<Trophy className="w-5 h-5" />}
        iconColor="text-yellow-500"
        statKey="goals"
        onClick={onStatClick}
        delay={0}
      />
      <StatCard
        label={t('playerStats.assists')}
        value={assists}
        icon={<Star className="w-5 h-5" />}
        iconColor="text-purple-400"
        statKey="assists"
        onClick={onStatClick}
        delay={0.1}
      />
      <StatCard
        label={t('playerStats.matches')}
        value={matches}
        icon={<Circle className="w-5 h-5" />}
        iconColor="text-gray-400"
        statKey="matches"
        onClick={onStatClick}
        delay={0.2}
      />
      <StatCard
        label={t('playerStats.rating')}
        value={rating}
        decimals={1}
        icon={<TrendingUp className="w-5 h-5" />}
        iconColor="text-green-500"
        statKey="rating"
        onClick={onStatClick}
        delay={0.3}
      />
    </motion.div>
  );
};

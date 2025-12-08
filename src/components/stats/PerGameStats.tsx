import { useTranslation } from 'react-i18next';

interface PerGameStatsProps {
  goalsPerGame: number;
  assistsPerGame: number;
  minutesPerGame: number;
}

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  decimals?: number;
  suffix?: string;
}

const StatBar = ({ label, value, maxValue, decimals = 2, suffix = '' }: StatBarProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-2">
      {/* Label and Value */}
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-white">
            {decimals > 0 ? value.toFixed(decimals) : value}
          </span>
          {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          style={{ width: `${percentage}%` }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
        />
      </div>
    </div>
  );
};

export const PerGameStats = ({
  goalsPerGame,
  assistsPerGame,
  minutesPerGame,
}: PerGameStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('playerStats.perGameAverage')}
        </h3>
      </div>

      {/* Stats Bars */}
      <div className="space-y-4">
        <StatBar
          label={t('playerStats.goalsPerGame')}
          value={goalsPerGame}
          maxValue={2}
          decimals={2}
        />
        <StatBar
          label={t('playerStats.assistsPerGame')}
          value={assistsPerGame}
          maxValue={2}
          decimals={2}
        />
        <StatBar
          label={t('playerStats.minutesPerGame')}
          value={minutesPerGame}
          maxValue={90}
          decimals={0}
          suffix="min"
        />
      </div>
    </div>
  );
};

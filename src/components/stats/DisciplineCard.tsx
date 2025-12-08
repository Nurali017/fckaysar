import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, XOctagon } from 'lucide-react';

interface DisciplineCardProps {
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
}

interface DisciplineItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  maxValue: number;
}

const DisciplineItem = ({
  label,
  value,
  icon,
  color,
  bgColor,
  maxValue,
}: DisciplineItemProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="flex items-center gap-3 p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all group">
      {/* Icon */}
      <div className={`flex-shrink-0 p-2 ${bgColor} rounded-lg`}>
        <div className={color}>{icon}</div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Label and Value */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-medium">{label}</span>
          <span className={`text-lg font-black ${color}`}>{value}</span>
        </div>

        {/* Mini bar */}
        <div className="relative h-1.5 bg-black/60 rounded-full overflow-hidden">
          <div
            style={{
              width: `${percentage}%`,
              background: color.includes('yellow')
                ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                : color.includes('red')
                  ? 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)'
                  : 'linear-gradient(90deg, #16a34a 0%, #22c55e 100%)',
            }}
            className="absolute inset-y-0 left-0 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export const DisciplineCard = ({
  yellowCards,
  redCards,
  cleanSheets,
}: DisciplineCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('playerStats.discipline')}
        </h3>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <DisciplineItem
          label={t('playerStats.yellowCards')}
          value={yellowCards}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="text-yellow-500"
          bgColor="bg-yellow-500/10"
          maxValue={10}
        />
        <DisciplineItem
          label={t('playerStats.redCards')}
          value={redCards}
          icon={<XOctagon className="w-4 h-4" />}
          color="text-red-500"
          bgColor="bg-red-500/10"
          maxValue={3}
        />
        <DisciplineItem
          label={t('playerStats.cleanSheets')}
          value={cleanSheets}
          icon={<Shield className="w-4 h-4" />}
          color="text-green-500"
          bgColor="bg-green-500/10"
          maxValue={15}
        />
      </div>
    </div>
  );
};

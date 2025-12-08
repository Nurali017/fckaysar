import { Shield, Target, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GoalkeeperStatsProps {
  cleanSheets: number;
  appearances: number;
  minutesPlayed: number;
}

export const GoalkeeperStats = ({
  cleanSheets,
  appearances,
  minutesPlayed,
}: GoalkeeperStatsProps) => {
  const { t } = useTranslation();

  const cleanSheetRate = appearances > 0
    ? Math.round((cleanSheets / appearances) * 100)
    : 0;

  const avgMinutes = appearances > 0
    ? Math.round(minutesPlayed / appearances)
    : 0;

  const stats = [
    {
      label: t('playerStats.cleanSheets'),
      value: cleanSheets,
      subtext: `${cleanSheetRate}%`,
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: t('playerStats.matches'),
      value: appearances,
      subtext: t('playerStats.season'),
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: t('playerStats.avgMinutes'),
      value: avgMinutes,
      subtext: t('playerStats.perGame'),
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
  ];

  return (
    <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
      <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-500" />
        {t('playerStats.goalkeeperStats')}
      </h4>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-4 text-center`}
            >
              <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className="text-3xl md:text-4xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              <div className={`text-sm font-semibold ${stat.color} mt-1`}>
                {stat.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clean Sheet Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">{t('playerStats.cleanSheetRate')}</span>
          <span className="text-green-500 font-bold">{cleanSheetRate}%</span>
        </div>
        <div className="h-3 bg-black/40 rounded-full overflow-hidden">
          <div
            style={{ width: `${cleanSheetRate}%` }}
            className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

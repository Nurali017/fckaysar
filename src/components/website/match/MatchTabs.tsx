import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BarChart3, Users, Eye } from 'lucide-react';

export type MatchTab = 'overview' | 'lineups' | 'stats';

interface MatchTabsProps {
  activeTab: MatchTab;
  onTabChange: (tab: MatchTab) => void;
  hasLineup?: boolean;
  hasStats?: boolean;
}

export const MatchTabs = ({
  activeTab,
  onTabChange,
  hasLineup = true,
  hasStats = true,
}: MatchTabsProps) => {
  const { t } = useTranslation();

  const tabs: { id: MatchTab; label: string; icon: React.ReactNode; available: boolean }[] = [
    {
      id: 'overview',
      label: t('match.tabs.overview', 'Обзор'),
      icon: <Eye className="w-4 h-4" />,
      available: true,
    },
    {
      id: 'lineups',
      label: t('match.tabs.lineups', 'Составы'),
      icon: <Users className="w-4 h-4" />,
      available: hasLineup,
    },
    {
      id: 'stats',
      label: t('match.tabs.stats', 'Статистика'),
      icon: <BarChart3 className="w-4 h-4" />,
      available: hasStats,
    },
  ];

  return (
    <div
      className="sticky top-20 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10"
      style={{ willChange: 'transform' }} // Safari fix for sticky + backdrop-blur
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="inline-flex gap-1 p-1 bg-white/5 rounded-xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => tab.available && onTabChange(tab.id)}
                disabled={!tab.available}
                className={`relative px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  !tab.available
                    ? 'text-gray-600 cursor-not-allowed'
                    : activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-red-600 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

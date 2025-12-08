import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Info, X } from 'lucide-react';
import type { RadarData } from '@/types/player';

interface PlayerRadarChartProps {
  data: RadarData[];
  playerName: string;
  onAttributeClick?: (attribute: string) => void;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
        <p className="font-bold text-white text-sm">{data.translatedSubject}</p>
        <p className="text-red-500 text-2xl font-black">{data.value}</p>
        <p className="text-xs text-gray-400 mt-1">{data.translatedDescription}</p>
      </div>
    );
  }
  return null;
};

export const PlayerRadarChart = ({
  data,
  playerName,
  onAttributeClick,
}: PlayerRadarChartProps) => {
  const { t } = useTranslation();
  const [showGuide, setShowGuide] = useState(false);

  // Transform data with translations
  const translatedData = data.map((item) => ({
    ...item,
    translatedSubject: t(`playerStats.attributes.${item.key}`),
    translatedDescription: t(`playerStats.attributeDescriptions.${item.key}`),
  }));

  // Attribute keys for guide
  const attributeKeys = ['shooting', 'passing', 'defense', 'attack', 'duels'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
    >
      {/* Info button */}
      <button
        onClick={() => setShowGuide(true)}
        className="absolute top-0 right-0 z-10 p-2 text-gray-400 hover:text-white transition-colors"
        title={t('playerStats.attributeGuide.title')}
      >
        <Info className="w-5 h-5" />
      </button>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {t('playerStats.attributeGuide.title')}
                </h3>
                <button
                  onClick={() => setShowGuide(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Attributes list */}
              <div className="space-y-3">
                {attributeKeys.map((key) => (
                  <div key={key} className="bg-black/40 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="font-semibold text-white">
                        {t(`playerStats.attributes.${key}`)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 pl-4">
                      {t(`playerStats.attributeGuide.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart container */}
      <div className="h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={translatedData}>
            {/* Grid */}
            <PolarGrid stroke="rgba(255,255,255,0.1)" gridType="polygon" />

            {/* Axis labels */}
            <PolarAngleAxis
              dataKey="translatedSubject"
              tick={{
                fill: '#9ca3af',
                fontSize: 12,
                fontWeight: 600,
              }}
              axisLine={false}
              onClick={(e: any) => {
                if (onAttributeClick && e?.value) {
                  onAttributeClick(e.value);
                }
              }}
              style={{ cursor: onAttributeClick ? 'pointer' : 'default' }}
            />

            {/* Radar area */}
            <Radar
              name={playerName}
              dataKey="value"
              stroke="#dc2626"
              strokeWidth={2}
              fill="#dc2626"
              fillOpacity={0.25}
              animationDuration={1000}
              animationEasing="ease-out"
            />

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-5xl font-black text-white/[0.03] tracking-widest">
            STATS
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {translatedData.map((item, index) => (
          <motion.button
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onAttributeClick?.(item.key)}
            className="px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-red-500/50 rounded-full text-xs font-medium text-gray-400 hover:text-white transition-all"
          >
            {item.translatedSubject}: <span className="text-white font-bold">{item.value}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

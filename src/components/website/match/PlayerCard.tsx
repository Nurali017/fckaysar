import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { LineupPlayer, LineupTeam } from '@/api/types/match-details-types';
import { transformImagePath } from '@/api/types/match-details-types';

interface PlayerCardProps {
  player: LineupPlayer;
  team: LineupTeam;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerCard = ({ player, team, isOpen, onClose }: PlayerCardProps) => {
  const { t } = useTranslation();

  const playerImage = transformImagePath(player.bas_image_path);
  const position = player.is_gk
    ? t('match.position.goalkeeper', 'Вратарь')
    : t('match.position.fieldPlayer', 'Полевой игрок');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
              {/* Header with team color */}
              <div
                className="relative h-32"
                style={{
                  background: `linear-gradient(135deg, ${team.brand_color}40 0%, transparent 100%)`,
                }}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Player number badge */}
                <div
                  className="absolute bottom-4 left-4 w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white"
                  style={{ backgroundColor: team.brand_color }}
                >
                  {player.number}
                </div>

                {/* Captain badge */}
                {player.is_captain && (
                  <div className="absolute bottom-4 left-20 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                    <Shield className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-500 font-medium">
                      {t('match.lineup.captain', 'Капитан')}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Player photo */}
                <div className="flex justify-center -mt-16 mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-900 overflow-hidden">
                      {player.bas_image_path ? (
                        <img
                          src={playerImage}
                          alt={player.full_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`fallback-icon w-full h-full flex items-center justify-center ${player.bas_image_path ? 'hidden' : ''}`}>
                        <User className="w-10 h-10 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Player name */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {player.full_name} {player.last_name}
                  </h3>
                  <p className="text-gray-400 text-sm">{position}</p>
                  <p className="text-gray-500 text-xs mt-1">{team.name}</p>
                </div>

                {/* Stats placeholder - would need match player stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-lg font-bold text-white">#{player.number}</div>
                    <div className="text-xs text-gray-500">{t('match.player.number', 'Номер')}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-lg font-bold text-white">{player.is_gk ? 'GK' : 'FP'}</div>
                    <div className="text-xs text-gray-500">{t('match.player.position', 'Позиция')}</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-lg font-bold text-white">
                      {player.is_captain ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-500">{t('match.player.captain', 'Капитан')}</div>
                  </div>
                </div>

                {/* View profile button */}
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={onClose}
                >
                  {t('match.player.close', 'Закрыть')}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

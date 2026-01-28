import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Scale, Calendar, MapPin, Users, Trophy } from 'lucide-react';
import type { MatchDetails } from '@/api/types/match-details-types';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MatchOverviewProps {
  match: MatchDetails;
}

export const MatchOverview = ({ match }: MatchOverviewProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Key Facts */}
      <motion.div
        initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {t('match.overview.keyFacts', 'Основная информация')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InfoItem
            icon={<Calendar className="w-4 h-4" />}
            label={t('match.overview.date', 'Дата')}
            value={match.date}
          />
          <InfoItem
            icon={<MapPin className="w-4 h-4" />}
            label={t('match.overview.tour', 'Тур')}
            value={match.stadium}
          />
          <InfoItem
            icon={<Trophy className="w-4 h-4" />}
            label={t('match.overview.competition', 'Турнир')}
            value={match.competition}
          />
          <InfoItem
            icon={<Users className="w-4 h-4" />}
            label={t('match.overview.status', 'Статус')}
            value={
              match.status === 'finished'
                ? t('match.status.finished', 'Завершён')
                : match.status === 'live'
                  ? t('match.status.live', 'В прямом эфире')
                  : t('match.status.upcoming', 'Ожидается')
            }
          />
        </div>
      </motion.div>

      {/* Referees */}
      {match.referees && (
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0 : 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-gray-400" />
            {t('match.referees.title', 'Судьи')}
          </h3>

          <div className="grid gap-3">
            {match.referees.main && (
              <RefereeItem
                role={t('match.referees.main', 'Главный судья')}
                name={match.referees.main}
                isPrimary
              />
            )}
            {match.referees['1st_assistant'] && (
              <RefereeItem
                role={t('match.referees.assistant1', 'Помощник 1')}
                name={match.referees['1st_assistant']}
              />
            )}
            {match.referees['2nd_assistant'] && (
              <RefereeItem
                role={t('match.referees.assistant2', 'Помощник 2')}
                name={match.referees['2nd_assistant']}
              />
            )}
            {match.referees['4th_referee'] && (
              <RefereeItem
                role={t('match.referees.fourth', 'Резервный судья')}
                name={match.referees['4th_referee']}
              />
            )}
            {match.referees.video_assistant_main && (
              <RefereeItem
                role={t('match.referees.var', 'VAR')}
                name={match.referees.video_assistant_main}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Stats Preview */}
      {match.teamStats && (
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0 : 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            {t('match.overview.quickStats', 'Быстрая статистика')}
          </h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold" style={{ color: match.homeTeam.brandColor }}>
                {match.teamStats.home.possession}%
              </div>
              <div className="text-xs text-gray-500 mt-1">{match.homeTeam.shortName}</div>
            </div>
            <div className="text-gray-400 text-sm self-center">
              {t('match.stats.possession', 'Владение')}
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: match.awayTeam.brandColor }}>
                {match.teamStats.away.possession}%
              </div>
              <div className="text-xs text-gray-500 mt-1">{match.awayTeam.shortName}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white">{match.teamStats.home.shot}</div>
              <div className="text-xs text-gray-500 mt-1">{t('match.stats.shots', 'Удары')}</div>
            </div>
            <div className="text-lg text-gray-600 self-center">vs</div>
            <div>
              <div className="text-xl font-bold text-white">{match.teamStats.away.shot}</div>
              <div className="text-xs text-gray-500 mt-1">{t('match.stats.shots', 'Удары')}</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-start gap-3">
    <div className="text-red-500 mt-0.5">{icon}</div>
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium text-white">{value}</div>
    </div>
  </div>
);

interface RefereeItemProps {
  role: string;
  name: string;
  isPrimary?: boolean;
}

const RefereeItem = ({ role, name, isPrimary }: RefereeItemProps) => (
  <div
    className={`flex justify-between items-center p-3 rounded-lg ${isPrimary ? 'bg-white/5' : ''}`}
  >
    <span className={`text-sm ${isPrimary ? 'text-white font-medium' : 'text-gray-400'}`}>
      {role}
    </span>
    <span className={`text-sm ${isPrimary ? 'text-white' : 'text-gray-300'}`}>{name}</span>
  </div>
);

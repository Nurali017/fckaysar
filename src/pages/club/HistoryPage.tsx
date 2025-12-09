import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { History, Trophy, Star, Users, Loader2, Medal, UserCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchAchievements } from '@/api/cms/achievements-service';
import { fetchVeterans } from '@/api/cms/veterans-service';
import type { AchievementItem, VeteranItem } from '@/api/cms/types';

const HistoryPage = () => {
  const { t } = useTranslation();

  // Реальные достижения ФК Кайсар
  const defaultAchievements: AchievementItem[] = [
    {
      id: '1',
      title: t('history.achievements.cup1999', 'Кубок Казахстана'),
      type: 'cup',
      year: 1999,
      place: '1',
      competition: t('history.achievements.cupKz', 'Кубок Казахстана по футболу'),
    },
    {
      id: '2',
      title: t('history.achievements.cup2019', 'Кубок Казахстана'),
      type: 'cup',
      year: 2019,
      place: '1',
      competition: t('history.achievements.cupKz', 'Кубок Казахстана по футболу'),
    },
    {
      id: '3',
      title: t('history.achievements.cupFinalist', 'Финалист Кубка Казахстана'),
      type: 'cup',
      year: 1998,
      place: 'finalist',
      competition: t('history.achievements.cupKz', 'Кубок Казахстана по футболу'),
    },
    {
      id: '4',
      title: t('history.achievements.firstLeague', 'Первая лига Казахстана'),
      type: 'championship',
      year: 1995,
      place: '1',
      competition: t('history.achievements.firstLeagueKz', 'Первая лига Казахстана'),
    },
    {
      id: '5',
      title: t('history.achievements.firstLeague', 'Первая лига Казахстана'),
      type: 'championship',
      year: 2005,
      place: '1',
      competition: t('history.achievements.firstLeagueKz', 'Первая лига Казахстана'),
    },
    {
      id: '6',
      title: t('history.achievements.asiaCup', 'Кубок обладателей кубков Азии'),
      type: 'eurocup',
      year: 2000,
      place: 'participant',
      competition: t('history.achievements.asiaCupDesc', '1/8 финала'),
    },
    {
      id: '7',
      title: t('history.achievements.europaLeague', 'Лига Европы УЕФА'),
      type: 'eurocup',
      year: 2020,
      place: 'participant',
      competition: t(
        'history.achievements.europaLeagueDesc',
        '2-й квалификационный раунд vs АПОЭЛ'
      ),
    },
    {
      id: '8',
      title: t('history.achievements.ussrLeague', 'Чемпионат СССР (2-я лига)'),
      type: 'championship',
      year: 1988,
      place: 'semifinalist',
      competition: t('history.achievements.ussrLeagueDesc', '4-е место'),
    },
    {
      id: '9',
      title: t('history.achievements.ussrLeague', 'Чемпионат СССР (2-я лига)'),
      type: 'championship',
      year: 1991,
      place: 'semifinalist',
      competition: t('history.achievements.ussrLeagueDesc', '4-е место'),
    },
  ];

  // Главные тренеры клуба
  const coaches = [
    { name: 'Андрей Ферапонтов', years: '2025-н.в.', current: true },
    { name: 'Виктор Кумыков', years: '2022-2025', current: false },
    { name: 'Стойчо Младенов', years: '2021', current: false },
    { name: 'Сергей Волгин', years: '2019-2020', current: false },
    { name: 'Дмитрий Огай', years: '2017-2018', current: false },
    { name: 'Федор Щербаченко', years: '2015-2016', current: false },
    { name: 'Сергей Когай', years: '2013-2014', current: false },
    { name: 'Альгимантас Любинскас', years: '2011-2012', current: false },
    { name: 'Хамид Дышеков', years: '2008-2010', current: false },
    { name: 'Сергей Абильдаев', years: '2006-2007', current: false },
  ];

  const timeline = [
    { year: '1968', event: t('history.timeline.1968', 'Основание футбольного клуба в Кызылорде') },
    {
      year: '1968-91',
      event: t(
        'history.timeline.ussr',
        'Участие в 24 чемпионатах СССР по футболу во 2-й лиге. 858 матчей.'
      ),
    },
    {
      year: '1988',
      event: t('history.timeline.1988', 'Лучший результат в СССР — 4-е место во второй лиге'),
    },
    {
      year: '1995',
      event: t('history.timeline.1995', 'Победа в Первой лиге Казахстана, выход в Высшую лигу'),
    },
    { year: '1999', event: t('history.timeline.1999', 'Первый Кубок Казахстана в истории клуба!') },
    {
      year: '2000',
      event: t('history.timeline.2000', 'Кубок обладателей кубков Азии — выход в 1/8 финала'),
      highlight: true,
    },
    { year: '2005', event: t('history.timeline.2005', 'Второй титул Первой лиги Казахстана') },
    {
      year: '2019',
      event: t('history.timeline.2019', 'Второй Кубок Казахстана — триумфальное возвращение!'),
    },
    {
      year: '2020',
      event: t('history.timeline.2020', 'Лига Европы УЕФА — 2-й раунд vs АПОЭЛ (1:4)'),
      highlight: true,
    },
    {
      year: '2024',
      event: t('history.timeline.2024', 'Новое руководство, начало масштабной трансформации клуба'),
    },
    {
      year: '2025',
      event: t(
        'history.timeline.2025',
        'Запуск стратегии развития 2025-2030, строительство Кайсар Арены'
      ),
    },
  ];

  // Fetch achievements from CMS (fallback to default if empty)
  const { data: cmsAchievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievements,
  });

  // Use CMS data if available, otherwise use default achievements
  const achievements = cmsAchievements.length > 0 ? cmsAchievements : defaultAchievements;

  // Fetch veterans from CMS
  const { data: veterans = [], isLoading: veteransLoading } = useQuery({
    queryKey: ['veterans'],
    queryFn: fetchVeterans,
  });

  const getPlaceLabel = (place?: string) => {
    const labels: Record<string, string> = {
      '1': t('history.place.1', 'Чемпион'),
      '2': t('history.place.2', 'Серебро'),
      '3': t('history.place.3', 'Бронза'),
      finalist: t('history.place.finalist', 'Финалист'),
      semifinalist: t('history.place.semifinalist', 'Полуфиналист'),
      participant: t('history.place.participant', 'Участник'),
    };
    return place ? labels[place] || place : '';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      championship: t('history.type.championship', 'Чемпионат'),
      cup: t('history.type.cup', 'Кубок'),
      eurocup: t('history.type.eurocup', 'Еврокубки'),
      award: t('history.type.award', 'Награда'),
      other: t('history.type.other', 'Другое'),
    };
    return labels[type] || type;
  };

  const getPositionLabel = (position?: string) => {
    const labels: Record<string, string> = {
      goalkeeper: t('team.positions.goalkeeper', 'Вратарь'),
      defender: t('team.positions.defender', 'Защитник'),
      midfielder: t('team.positions.midfielder', 'Полузащитник'),
      forward: t('team.positions.forward', 'Нападающий'),
      coach: t('history.position.coach', 'Тренер'),
    };
    return position ? labels[position] || position : '';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <History className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
              {t('history.title', 'Тарих')}
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              {t('history.subtitle', 'История, достижения и легенды клуба')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-red-500/20 text-red-500 text-sm font-bold rounded-full mb-4">
              {t('history.tabs.history', 'История')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {t('history.timelineTitle', 'Наш путь')}
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 mb-8"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span
                    className={`text-2xl md:text-3xl font-black ${item.highlight ? 'text-blue-400' : 'text-red-500'}`}
                  >
                    {item.year}
                  </span>
                </div>
                <div
                  className={`flex-shrink-0 w-4 h-4 mt-3 rounded-full relative ${item.highlight ? 'bg-blue-400' : 'bg-red-500'}`}
                >
                  {index < timeline.length - 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-red-500/30" />
                  )}
                </div>
                <div
                  className={`flex-grow rounded-xl p-5 border transition-colors ${
                    item.highlight
                      ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-400'
                      : 'bg-white/5 border-white/10 hover:border-red-500/30'
                  }`}
                >
                  {item.highlight && (
                    <span className="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded mb-2">
                      {t('history.euroCups', 'ЕВРОКУБКИ')}
                    </span>
                  )}
                  <p className="text-gray-300 text-lg">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-yellow-500/20 text-yellow-500 text-sm font-bold rounded-full mb-4">
              <Trophy className="w-4 h-4 inline mr-1" />
              {t('history.tabs.achievements', 'Достижения')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {t('history.achievementsTitle', 'Наши трофеи')}
            </h2>
          </motion.div>

          {achievementsLoading && cmsAchievements.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {achievements.map((achievement: AchievementItem, index: number) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {achievement.imageUrl ? (
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.title}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Medal className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl font-black text-red-500">{achievement.year}</span>
                        {achievement.place && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded">
                            {getPlaceLabel(achievement.place)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{achievement.title}</h3>
                      {achievement.competition && (
                        <p className="text-sm text-gray-400">{achievement.competition}</p>
                      )}
                      <span className="inline-block mt-2 px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded">
                        {getTypeLabel(achievement.type)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Veterans Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-red-500/20 text-red-500 text-sm font-bold rounded-full mb-4">
              <Star className="w-4 h-4 inline mr-1" />
              {t('history.tabs.veterans', 'Ветераны')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {t('history.veteransTitle', 'Легенды клуба')}
            </h2>
          </motion.div>

          {veteransLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : veterans.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg">
                {t('history.noVeterans', 'Информация о ветеранах скоро будет добавлена')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {veterans.map((veteran: VeteranItem, index: number) => (
                <motion.div
                  key={veteran.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/30 transition-all group"
                >
                  {/* Photo */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-gray-800 to-black">
                    {veteran.photoUrl ? (
                      <img
                        src={veteran.photoUrl}
                        alt={veteran.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-20 h-20 text-gray-600" />
                      </div>
                    )}
                    {/* Legend badge */}
                    {veteran.isLegend && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {t('history.legend', 'Легенда')}
                      </div>
                    )}
                    {/* Number */}
                    {veteran.jerseyNumber && (
                      <div className="absolute bottom-3 left-3 text-6xl font-black text-white/20">
                        {veteran.jerseyNumber}
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{veteran.displayName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      {veteran.position && <span>{getPositionLabel(veteran.position)}</span>}
                      {veteran.yearsInClub && (
                        <>
                          <span>•</span>
                          <span>{veteran.yearsInClub}</span>
                        </>
                      )}
                    </div>
                    {veteran.statistics && (
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{t('history.matches', 'Матчи')}: </span>
                          <span className="text-white font-bold">{veteran.statistics.matches}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('history.goals', 'Голы')}: </span>
                          <span className="text-white font-bold">{veteran.statistics.goals}</span>
                        </div>
                      </div>
                    )}
                    {veteran.achievements && (
                      <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                        {veteran.achievements}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-400 text-sm font-bold rounded-full mb-4">
              <UserCircle className="w-4 h-4 inline mr-1" />
              {t('history.coachesSection', 'Тренеры')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {t('history.coachesTitle', 'Главные тренеры')}
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coaches.map((coach, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    coach.current
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      coach.current ? 'bg-red-500' : 'bg-white/10'
                    }`}
                  >
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{coach.name}</h3>
                    <p className="text-sm text-gray-400">{coach.years}</p>
                  </div>
                  {coach.current && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      {t('history.currentCoach', 'Сейчас')}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HistoryPage;

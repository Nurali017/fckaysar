import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Target,
  Calendar,
  Building,
  Handshake,
  Phone,
  ChevronRight,
  Award,
} from 'lucide-react';
import kaisarLogo from '@/assets/kaysar-logo-nobg.png';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';

const ClubPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const sections = [
    {
      icon: Users,
      title: t('club.leadership', 'Руководство'),
      description: t('club.leadershipDesc', 'Административная структура клуба'),
      path: '/club/leadership',
    },
    {
      icon: Trophy,
      title: t('club.history', 'История'),
      description: t('club.historyDesc', 'От основания до наших дней'),
      path: '/club/history',
    },
    {
      icon: Handshake,
      title: t('club.partners', 'Партнёры'),
      description: t('club.partnersDesc', 'Спонсоры и партнёры клуба'),
      path: '/club/partners',
    },
    {
      icon: Phone,
      title: t('club.contacts', 'Контакты'),
      description: t('club.contactsDesc', 'Связаться с нами'),
      path: '/club/contacts',
    },
  ];

  const goals = [
    { year: '2029', goal: t('club.goal2029', 'Призовые места в чемпионате РК, Финал Кубка') },
    { year: '2030', goal: t('club.goal2030', 'Чемпионство РК, выход в групповой этап еврокубка') },
    {
      year: t('club.by2030', 'К 2030'),
      goal: t('club.goalSelfSufficiency', 'Выход клуба на самоокупаемость'),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[350px] md:min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/stadium/IMG_9742.JPG')`,
          }}
        />
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.8 }}
            className="flex flex-col items-center"
          >
            <img
              src={kaisarLogo}
              alt="FC KAYSAR"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-4 sm:mb-6"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-3 sm:mb-4">
              {t('club.fcName', 'ФК')}{' '}
              <span className="text-red-500">{t('club.kaisar', 'Кайсар')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
              {t('club.foundedInfo', 'Кызылорда • Основан в 1968 году')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
          >
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('club.ourMission', 'Наша миссия')}
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              {t(
                'club.missionText',
                'Стать локальным аналогом британского «Саутгемптона» — кузницей молодых талантов, которые формируются внутри нашей системы и достигают высоких результатов на национальной и международной арене.'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Strategy 2025-2030 */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
            className="text-center mb-16"
          >
            <Calendar className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-4">
              {t('club.strategy', 'Стратегия 2025–2030')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'club.strategyDesc',
                'Стратегическое партнёрство с клубами Турции, Сербии и Хорватии'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {goals.map((item, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? 0 : index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-black text-red-500 mb-2">{item.year}</div>
                <p className="text-gray-300">{item.goal}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Award className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="text-xl font-bold mb-2">{t('club.sport', 'Спорт')}</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• {t('club.sportItem1', 'Развитие молодежной академии')}</li>
                <li>• {t('club.sportItem2', 'Интеграция молодёжи в основную команду')}</li>
                <li>• {t('club.sportItem3', 'Высокие спортивные результаты')}</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <Building className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="text-xl font-bold mb-2">{t('club.business', 'Бизнес')}</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• {t('club.businessItem1', 'Коммерциализация бренда')}</li>
                <li>• {t('club.businessItem2', 'Инвестирование в инфраструктуру')}</li>
                <li>• {t('club.businessItem3', 'Финансовая стабильность')}</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-4">
              {t('club.sections', 'Разделы')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? 0 : index * 0.1 }}
              >
                <Link
                  to={section.path}
                  className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 group"
                >
                  <section.icon className="w-10 h-10 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                    {section.title}
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClubPage;

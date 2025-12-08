import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const AcademyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <WebsiteHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />

          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-red-600 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-36 h-36 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-red-800 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              {/* Icon */}
              <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-600/20 border border-red-600/30">
                <Construction className="w-12 h-12 text-red-500" />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {t('academy.title', 'Академия')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-400 mb-4">
                {t('academy.comingSoon', 'Раздел в разработке')}
              </p>

              {/* Description */}
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                {t('academy.description', 'Мы работаем над созданием раздела Академии FC Kaisar. Здесь будет информация о нашей футбольной школе, тренерском составе и программах подготовки молодых талантов.')}
              </p>

              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">{t('academy.progress', 'Прогресс разработки')}</span>
                </div>
                <div className="w-full max-w-[256px] mx-auto h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-1 block">35%</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center">
                <Link to="/">
                  <Button variant="outline" className="border-gray-700 hover:border-gray-600 hover:bg-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.backToHome', 'На главную')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-12 text-gray-400">
              {t('academy.whatToExpect', 'Что будет в разделе')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t('academy.feature1Title', 'Программы обучения'),
                  description: t('academy.feature1Desc', 'Информация о тренировочных программах для разных возрастных групп')
                },
                {
                  title: t('academy.feature2Title', 'Тренерский состав'),
                  description: t('academy.feature2Desc', 'Профили наших квалифицированных тренеров и их достижения')
                },
                {
                  title: t('academy.feature3Title', 'Запись в академию'),
                  description: t('academy.feature3Desc', 'Онлайн-форма для записи на просмотр и обучение')
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center mb-4">
                    <span className="text-red-500 font-bold">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AcademyPage;

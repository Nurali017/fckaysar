import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PlayerRecommendationForm from '@/components/forms/PlayerRecommendationForm';

const RecommendPlayerPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <UserPlus className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              {t('playerRecommendation.title', 'Рекомендация игрока')}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'playerRecommendation.subtitle',
                'Знаете талантливого футболиста? Расскажите нам о нем, и мы рассмотрим возможность приглашения на просмотр.'
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10"
          >
            <PlayerRecommendationForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecommendPlayerPage;

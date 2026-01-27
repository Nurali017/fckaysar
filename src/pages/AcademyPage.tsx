import { Footer } from '@/components/website/Footer';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PageWrapper } from '@/components/website/PageWrapper';
import { SEO } from '@/components/SEO';

const AcademyPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <PageWrapper>
      <SEO title="Академия" description="Футбольная академия ФК Кайсар" path="/academy" />
      <main className="min-h-screen bg-[hsl(222,47%,11%)] pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.8 }}
              className="max-w-2xl mx-auto"
            >
              {/* Icon */}
              <div className="mb-8 inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-red-600/20 border border-red-600/30">
                <Construction className="w-12 h-12 text-red-500" />
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display uppercase tracking-tighter mb-6 text-white leading-none">
                {t('academy.title', 'Academy')}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-red-500 font-mono uppercase tracking-widest mb-4">
                {t('academy.comingSoon', 'Coming Soon')}
              </p>

              {/* Description */}
              <p className="text-white/60 mb-8 max-w-lg mx-auto font-mono text-sm leading-relaxed">
                {t(
                  'academy.description',
                  'We are working on the FC Kaisar Academy section. Here you will find information about our football school, coaching staff, and youth development programs.'
                )}
              </p>

              {/* Progress indicator */}
              <div className="mb-8 max-w-[300px] mx-auto">
                <div className="flex items-center justify-between mb-2 font-mono text-xs uppercase text-white/40">
                  <span>{t('academy.progress', 'Development Progress')}</span>
                  <span>35%</span>
                </div>
                <div className="w-full h-1 bg-white/10">
                  <motion.div
                    className="h-full bg-red-600"
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center">
                <Link to="/">
                  <Button
                    variant="outline"
                    className="border-white/20 hover:border-red-600 hover:bg-red-600 text-white rounded-none uppercase font-mono tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.backToHome', 'Back to Home')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-8 md:py-12 lg:py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-display uppercase text-center mb-12 text-white">
              {t('academy.whatToExpect', 'What to Expect')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: t('academy.feature1Title', 'Training Programs'),
                  description: t(
                    'academy.feature1Desc',
                    'Information about training programs for different age groups'
                  ),
                },
                {
                  title: t('academy.feature2Title', 'Coaching Staff'),
                  description: t(
                    'academy.feature2Desc',
                    'Profiles of our qualified coaches and their achievements'
                  ),
                },
                {
                  title: t('academy.feature3Title', 'Academy Registration'),
                  description: t('academy.feature3Desc', 'Online form for tryouts and enrollment'),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: isMobile ? 0 : 0.5,
                    delay: isMobile ? 0 : 0.2 + index * 0.1,
                  }}
                  className="p-4 md:p-6 lg:p-8 bg-white/5 border border-white/5 hover:border-red-600/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-600/20 flex items-center justify-center mb-6 border border-red-600/20 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <span className="font-display text-xl text-red-500 group-hover:text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-display uppercase text-xl mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/40 font-mono leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageWrapper>
  );
};

export default AcademyPage;

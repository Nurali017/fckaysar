import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';

const FansPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const sections = [
    {
      icon: FileText,
      title: t('fans.rulesTitle', 'Правила посещения'),
      description: t('fans.rulesSubtitle', 'Что можно и нельзя на стадионе'),
      path: '/fans/rules',
    },
    {
      icon: HelpCircle,
      title: t('nav.faq', 'FAQ'),
      description: t('fans.faqTitle', 'Часто задаваемые вопросы'),
      path: '/fans/faq',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
            className="text-center mb-16"
          >
            <Users className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {t('fans.title', 'Болельщику')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('fans.subtitle', 'Полезная информация для фанатов')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                  className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 group h-full"
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

export default FansPage;

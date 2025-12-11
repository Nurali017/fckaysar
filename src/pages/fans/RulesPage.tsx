import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { FileText, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';

const RulesPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const allowed = [
    t('fans.allowedItems.attributes', 'Болельщицкая атрибутика'),
    t('fans.allowedItems.flags', 'Флаги и баннеры (без оскорблений)'),
    t('fans.allowedItems.instruments', 'Музыкальные инструменты (барабаны)'),
    t('fans.allowedItems.food', 'Еда в заводской упаковке'),
  ];

  const prohibited = [
    t('fans.prohibitedItems.alcohol', 'Алкогольные напитки'),
    t('fans.prohibitedItems.glass', 'Стеклянная тара'),
    t('fans.prohibitedItems.pyro', 'Пиротехника и дымовые шашки'),
    t('fans.prohibitedItems.weapons', 'Оружие и острые предметы'),
    t('fans.prohibitedItems.banners', 'Баннеры с оскорблениями'),
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
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {t('fans.rulesTitle', 'Правила посещения')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('fans.rulesSubtitle', 'Что можно и нельзя на стадионе')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: isMobile ? 0 : 0.5 }}
              className="bg-green-900/20 rounded-2xl p-6 border border-green-500/30"
            >
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <Check className="w-6 h-6" /> {t('fans.allowed', 'Разрешено')}
              </h3>
              <ul className="space-y-3">
                {allowed.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: isMobile ? 0 : 0.5 }}
              className="bg-red-900/20 rounded-2xl p-6 border border-red-500/30"
            >
              <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                <X className="w-6 h-6" /> {t('fans.prohibited', 'Запрещено')}
              </h3>
              <ul className="space-y-3">
                {prohibited.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RulesPage;

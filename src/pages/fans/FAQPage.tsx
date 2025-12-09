import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FAQPage = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t('fans.faq.q1', 'Где купить билеты на матч?'),
      answer: t(
        'fans.faq.a1',
        'Билеты можно приобрести на официальном сайте клуба или в кассах стадиона в день матча.'
      ),
    },
    {
      question: t('fans.faq.q2', 'Во сколько открываются ворота стадиона?'),
      answer: t('fans.faq.a2', 'Ворота стадиона открываются за 2 часа до начала матча.'),
    },
    {
      question: t('fans.faq.q3', 'Есть ли парковка у стадиона?'),
      answer: t(
        'fans.faq.a3',
        'Да, рядом со стадионом есть 500-700 парковочных мест. Парковка бесплатная.'
      ),
    },
    {
      question: t('fans.faq.q4', 'Можно ли проносить еду на стадион?'),
      answer: t(
        'fans.faq.a4',
        'Разрешена еда в заводской упаковке. Напитки в стеклянной таре запрещены.'
      ),
    },
    {
      question: t('fans.faq.q5', 'Как добраться до стадиона?'),
      answer: t(
        'fans.faq.a5',
        'До стадиона можно добраться на автомобиле или общественном транспорте.'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <HelpCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {t('nav.faq', 'FAQ')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('fans.faqTitle', 'Часто задаваемые вопросы')}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-red-500 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && <div className="px-6 pb-6 text-gray-400">{faq.answer}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;

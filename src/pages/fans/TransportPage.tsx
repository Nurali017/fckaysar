import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { Car, Bus, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TransportPage = () => {
  const { t } = useTranslation();

  const transport = [
    {
      icon: Car,
      title: t('fans.byCar', 'На автомобиле'),
      description: t('fans.byCarDesc', '500-700 парковочных мест рядом со стадионом'),
    },
    {
      icon: Bus,
      title: t('fans.byBus', 'Общественный транспорт'),
      description: t('fans.byBusDesc', 'Автобусные маршруты до стадиона'),
    },
    {
      icon: MapPin,
      title: t('stadium.location', 'Адрес'),
      description: t('stadium.address', 'г. Кызылорда, Кайсар Арена'),
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
            <Car className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {t('fans.transportTitle', 'Как добраться')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('fans.transportSubtitle', 'Маршруты до Кайсар Арены')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {transport.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center"
              >
                <item.icon className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48996.95386655893!2d65.47!3d44.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41f643e1e90e9b0b%3A0x57c1d3c49d89e8e!2sKyzylorda%2C%20Kazakhstan!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TransportPage;

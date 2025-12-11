import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

const ContactsPage = () => {
  const isMobile = useIsMobile();
  const contacts = [
    {
      icon: MapPin,
      title: 'Адрес',
      info: 'г. Кызылорда, Казахстан',
      subinfo: 'Кайсар Арена',
    },
    {
      icon: Phone,
      title: 'Телефон',
      info: '+7 (7242) XX-XX-XX',
      subinfo: 'Пн-Пт: 9:00-18:00',
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'info@fckaysar.kz',
      subinfo: 'Для общих вопросов',
    },
    {
      icon: Clock,
      title: 'Часы работы',
      info: 'Пн-Пт: 9:00-18:00',
      subinfo: 'Сб-Вс: выходной',
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
            <Phone className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Контакты
            </h1>
            <p className="text-gray-400 text-lg">Свяжитесь с нами</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {contacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? 0 : index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center"
              >
                <contact.icon className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">{contact.title}</h3>
                <p className="text-white mb-1">{contact.info}</p>
                <p className="text-gray-500 text-sm">{contact.subinfo}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 0 : 0.5 }}
            className="mt-12 max-w-4xl mx-auto"
          >
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
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactsPage;

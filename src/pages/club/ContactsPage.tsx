import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { Mail, Clock, MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTranslation } from 'react-i18next';

const ContactsPage = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const contacts = [
    {
      icon: Mail,
      title: t('contacts.email'),
      info: t('contacts.emailInfo'),
      subinfo: t('contacts.emailSub'),
    },
    {
      icon: Clock,
      title: t('contacts.workHours'),
      info: t('contacts.workHoursInfo'),
      subinfo: t('contacts.workHoursSub'),
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
            <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4">
              {t('contacts.title')}
            </h1>
            <p className="text-gray-400 text-lg">{t('contacts.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactsPage;

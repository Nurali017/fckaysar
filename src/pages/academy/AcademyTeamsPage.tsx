import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

const AcademyTeamsPage = () => {
  const isMobile = useIsMobile();
  const teams = [
    { name: 'Кайсар U-21', category: 'Молодёжка', description: 'Молодёжная команда клуба' },
    { name: 'Кайсар U-19', category: 'Юниоры', description: 'Юниорская команда' },
    { name: 'Кайсар U-17', category: 'Юноши', description: 'Юношеская команда' },
    { name: 'Кайсар U-16', category: 'Юноши', description: 'Юношеская команда' },
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
            <Users className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-4">
              Молодёжные команды
            </h1>
            <p className="text-gray-400 text-lg">Будущее клуба</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {teams.map((team, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? 0 : index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              >
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  {team.category}
                </span>
                <h3 className="text-2xl font-bold mt-2 mb-2">{team.name}</h3>
                <p className="text-gray-400">{team.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AcademyTeamsPage;

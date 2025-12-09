import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const LeadershipPage = () => {
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
            <Users className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Руководство
            </h1>
            <p className="text-gray-400 text-lg">Административная структура ФК Кайсар</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-2xl p-12 border border-white/10 text-center">
              <p className="text-gray-400 text-lg">
                Информация о руководстве клуба будет добавлена в ближайшее время.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LeadershipPage;

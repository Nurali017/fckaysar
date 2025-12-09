import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import { MapPin, Building } from 'lucide-react';

const AcademyBranchesPage = () => {
  const branches = [
    { name: 'Кызылорда', status: 'Главный филиал', description: 'Основная база академии' },
    {
      name: 'Региональные филиалы',
      status: 'В развитии',
      description: 'Планируется открытие в 2025-2027',
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
            <Building className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Филиалы ФЦ
            </h1>
            <p className="text-gray-400 text-lg">Футбольные центры ФК Кайсар</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {branches.map((branch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <MapPin className="w-8 h-8 text-red-500 mb-3" />
                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">
                  {branch.status}
                </span>
                <h3 className="text-2xl font-bold mt-2 mb-2">{branch.name}</h3>
                <p className="text-gray-400">{branch.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-gradient-to-r from-red-900/20 to-red-800/10 rounded-2xl border border-red-500/20 max-w-4xl mx-auto text-center"
          >
            <h3 className="text-xl font-bold mb-2">План развития</h3>
            <p className="text-gray-400">
              К 2030 году планируется увеличение числа обучающихся до 1000 человек и открытие
              филиалов в западных и южных регионах Казахстана.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AcademyBranchesPage;

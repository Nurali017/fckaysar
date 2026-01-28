import { PageWrapper } from '@/components/website/PageWrapper';
import { motion } from 'framer-motion';
import {
  History,
  Landmark,
  Mountain,
  Rocket,
  Music,
  Building,
  Users,
  Waves,
  TreePine,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/useIsMobile';

const CityPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const timeline = [
    {
      year: '1820',
      event: t('city.timeline1', 'Foundation of Ak-Mechet fortress'),
    },
    {
      year: '1853',
      event: t('city.timeline2', 'Conquered by Russian troops under General Perovsky'),
    },
    { year: '1867', event: t('city.timeline3', 'Renamed into Perovsk city') },
    { year: '1925', event: t('city.timeline4', 'Renamed into Kyzylorda (Red Capital)') },
    { year: '1925-1929', event: t('city.timeline5', 'First capital of Kazakh ASSR') },
    {
      year: t('city.today', 'Today'),
      event: t('city.timeline6', 'Administrative center of Kyzylorda region'),
    },
  ];

  const attractions = [
    {
      icon: Rocket,
      title: t('city.baikonur', 'Baikonur Cosmodrome'),
      description: t(
        'city.baikonurDescFull',
        'Kyzylorda is the nearest city to the legendary cosmodrome.'
      ),
      highlight: true,
    },
    {
      icon: Music,
      title: t('city.korkyt', 'Korkyt Ata Memorial'),
      description: t('city.korkytDescFull', '170 km from the city. Complex on the Syr Darya bank.'),
    },
    {
      icon: Waves,
      title: t('city.aral', 'Aral Sea'),
      description: t(
        'city.aralDescFull',
        'Ecological tourism and unique opportunity to see the sea.'
      ),
    },
    {
      icon: Landmark,
      title: t('city.ancient', 'Ancient Settlements'),
      description: t(
        'city.ancientDescFull',
        'Jend, Jankent, Syganak, Chirik-Rabat - ruins of ancient trade centers.'
      ),
    },
    {
      icon: Building,
      title: t('city.museum', 'History Museum'),
      description: t(
        'city.museumDescFull',
        'About 10 halls with expositions about geology and history.'
      ),
    },
    {
      icon: Users,
      title: t('city.centralSquare', 'Central Square'),
      description: t('city.centralSquareDesc', 'Renovated in 2024. Monument to Roza Baglanova.'),
    },
  ];

  const nature = [
    {
      icon: Waves,
      title: t('city.syrdarya', 'Syr Darya River'),
      description: t('city.syrdaryaDescFull', 'Main water artery of the region'),
    },
    {
      icon: Mountain,
      title: t('city.desert', 'Kyzylkum Desert'),
      description: t('city.desertDescFull', 'Red Sand - unique landscape'),
    },
    {
      icon: Waves,
      title: t('city.lake', 'Kamystybas Lake'),
      description: t('city.lakeDescFull', 'Salty lake with healing properties'),
    },
    {
      icon: TreePine,
      title: t('city.mud', 'Zhanakorgan Mud'),
      description: t('city.mudDesc', 'Healing muds helping with many diseases'),
    },
  ];

  return (
    <PageWrapper>
      <main className="min-h-screen bg-[hsl(222,47%,11%)]">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[hsl(222,47%,11%)] z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80')`,
            }}
          />
          <div className="relative z-20 text-center px-4 pt-20">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-red-600 text-white font-mono text-xs uppercase tracking-widest mb-6">
                {t('city.ourCity', 'Our City')}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl font-display uppercase tracking-tighter mb-4 text-white leading-none">
                {t('city.kyzyl', 'Kyzyl')}
                <span className="text-red-500">{t('city.orda', 'orda')}</span>
              </h1>
              <p className="font-mono text-sm md:text-base text-gray-300 max-w-3xl mx-auto uppercase tracking-wider">
                {t('city.heroSubtitle', 'First Capital • Land of Legends • Birthplace of Songs')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="py-12 border-y border-white/5 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center md:divide-x divide-white/10">
              {[
                { val: '1820', label: t('city.yearFounded', 'Founded') },
                { val: '~300K', label: t('city.population', 'Population') },
                { val: '500+', label: t('city.monumentsCount', 'Monuments') },
                { val: '1925', label: t('city.capitalASSR', 'Capital (1925)') },
              ].map((stat, i) => (
                <div key={i} className="px-2">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-display text-white mb-2">
                    {stat.val}
                  </div>
                  <div className="text-xs font-mono text-red-500 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <History className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
                {t('city.historyTitle', 'History')}
              </h2>
            </div>

            <div className="max-w-4xl mx-auto border-l border-white/10 pl-6 md:pl-12 space-y-8 md:space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <span className="absolute -left-[33px] md:-left-[57px] top-1 w-4 h-4 md:w-5 md:h-5 bg-red-600 border-4 border-[hsl(222,47%,11%)]" />
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <span className="text-3xl font-display text-white/40 w-24 flex-shrink-0">
                      {item.year}
                    </span>
                    <p className="text-lg text-white font-mono leading-relaxed">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Attractions */}
        <section className="py-20 bg-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Landmark className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
                {t('city.attractions', 'Attractions')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 md:p-6 lg:p-8 border hover:border-red-500/50 transition-all duration-300 group ${
                    item.highlight
                      ? 'bg-red-900/10 border-red-500/20'
                      : 'bg-black/20 border-white/5'
                  }`}
                >
                  <item.icon
                    className={`w-10 h-10 mb-6 ${item.highlight ? 'text-white' : 'text-red-500'}`}
                  />
                  <h3 className="text-2xl font-display uppercase text-white mb-3 group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-sm font-mono leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nature */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <TreePine className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
                {t('city.nature', 'Nature')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
              {nature.map((item, index) => (
                <div
                  key={index}
                  className="bg-[hsl(222,47%,11%)] p-8 text-center hover:bg-white/5 transition-colors group"
                >
                  <item.icon className="w-10 h-10 text-green-500 mx-auto mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-display uppercase text-white mb-2">{item.title}</h3>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-wide">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
      </main>
    </PageWrapper>
  );
};

export default CityPage;

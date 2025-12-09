import { PageWrapper } from '@/components/website/PageWrapper';
import { motion } from 'framer-motion';
import {
  MapPin,
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

const CityPage = () => {
  const { t } = useTranslation();

  const timeline = [
    {
      year: '1820',
      event: t('city.timeline1', 'Основание крепости Ак-Мечеть Кокандского ханства'),
    },
    {
      year: '1853',
      event: t(
        'city.timeline2',
        'Завоёвана русскими войсками под командованием генерала Перовского'
      ),
    },
    { year: '1867', event: t('city.timeline3', 'Переименована в город Перовск') },
    { year: '1925', event: t('city.timeline4', 'Переименована в Кызылорда (Красная Столица)') },
    { year: '1925-1929', event: t('city.timeline5', 'Первая столица Казахской АССР') },
    {
      year: t('city.today', 'Сегодня'),
      event: t('city.timeline6', 'Административный центр Кызылординской области'),
    },
  ];

  const attractions = [
    {
      icon: Rocket,
      title: t('city.baikonur', 'Космодром Байконур'),
      description: t(
        'city.baikonurDescFull',
        'Кызылорда — ближайший город к легендарному космодрому. Отсюда стартуют туристы, желающие увидеть запуск ракеты.'
      ),
      highlight: true,
    },
    {
      icon: Music,
      title: t('city.korkyt', 'Мемориал Коркыт-Ата'),
      description: t(
        'city.korkytDescFull',
        '170 км от города. Комплекс на берегу Сырдарьи построен в 1980 году на месте мавзолея средневекового огузского поэта.'
      ),
    },
    {
      icon: Waves,
      title: t('city.aral', 'Аральское море'),
      description: t(
        'city.aralDescFull',
        'Экологический туризм и уникальная возможность увидеть последствия экологической катастрофы.'
      ),
    },
    {
      icon: Landmark,
      title: t('city.ancient', 'Древние городища'),
      description: t(
        'city.ancientDescFull',
        'Дженд, Жанкент (Янгикент), Сыганак, Чирик-Рабат — руины древних торговых центров и ставок степных ханов.'
      ),
    },
    {
      icon: Building,
      title: t('city.museum', 'Историко-краеведческий музей'),
      description: t(
        'city.museumDescFull',
        'Около 10 залов с экспозициями о геологии, животном мире и истории региона.'
      ),
    },
    {
      icon: Users,
      title: t('city.centralSquare', 'Центральная площадь'),
      description: t(
        'city.centralSquareDesc',
        'Обновлена в 2024 году. Памятник Розе Баглановой — легендарной оперной певице.'
      ),
    },
  ];

  const nature = [
    {
      icon: Waves,
      title: t('city.syrdarya', 'Река Сырдарья'),
      description: t('city.syrdaryaDescFull', 'Главная водная артерия Кызылординской области'),
    },
    {
      icon: Mountain,
      title: t('city.desert', 'Пустыня Кызылкум'),
      description: t('city.desertDescFull', '«Красный песок» — уникальный ландшафт'),
    },
    {
      icon: Waves,
      title: t('city.lake', 'Озеро Камыстыбас'),
      description: t('city.lakeDescFull', 'Солёное озеро с лечебными свойствами'),
    },
    {
      icon: TreePine,
      title: t('city.mud', 'Грязи Жанакоргана'),
      description: t('city.mudDesc', 'Лечебные грязи, помогающие при многих заболеваниях'),
    },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80')`,
          }}
        />
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold uppercase tracking-wider mb-6">
              {t('city.ourCity', 'Наш город')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-4">
              {t('city.kyzyl', 'Кызыл')}
              <span className="text-red-500">{t('city.orda', 'орда')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('city.heroSubtitle', 'Первая столица Казахстана • Край ста жырау • Родина песни')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black">1820</div>
              <div className="text-sm text-white/80">{t('city.yearFounded', 'Год основания')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black">~300K</div>
              <div className="text-sm text-white/80">{t('city.population', 'Население')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black">500+</div>
              <div className="text-sm text-white/80">
                {t('city.monumentsCount', 'Памятников истории')}
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black">1925</div>
              <div className="text-sm text-white/80">
                {t('city.capitalASSR', 'Столица КазАССР')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <History className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('city.historyTitle', 'История города')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('city.historySubtitle', 'От караванных путей до первой столицы Казахстана')}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 mb-8"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-2xl font-black text-red-500">{item.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 mt-2 rounded-full bg-red-500 relative">
                  {index < timeline.length - 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-red-500/30" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="text-lg text-gray-300">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 max-w-4xl mx-auto"
          >
            <p className="text-gray-300 text-center">
              <span className="text-yellow-400 font-bold">
                {t('city.heritage', '«Край ста жырау»')}
              </span>{' '}
              —{' '}
              {t(
                'city.heritageText',
                'здесь жили и творили многие музыканты древности и современности. Издревле здесь процветал вид искусства «жыршы», благодаря чему город известен как'
              )}
              <span className="text-red-400 font-bold">
                {' '}
                {t('city.songBirthplace', '«Родина песни»')}
              </span>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* Attractions */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Landmark className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('city.attractions', 'Достопримечательности')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('city.attractionsSubtitle', 'Центр Великого шёлкового пути и казахской культуры')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                  item.highlight
                    ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/20 border-blue-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <item.icon
                  className={`w-10 h-10 mb-4 ${item.highlight ? 'text-blue-400' : 'text-red-500'}`}
                />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nature */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <TreePine className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('city.nature', 'Природа')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('city.natureSubtitle', 'Уникальные ландшафты и лечебные источники')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nature.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-900/20 to-teal-900/10 border border-green-500/20 rounded-2xl p-6 text-center"
              >
                <item.icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('city.location', 'Расположение')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">{t('city.howToGet', 'Как добраться')}</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✈️</span>
                  <div>
                    <p className="font-semibold">{t('city.airport', 'Аэропорт Кызылорда')}</p>
                    <p className="text-sm text-gray-400">
                      {t('city.airportDesc', 'Регулярные рейсы из Алматы и Астаны')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">🚂</span>
                  <div>
                    <p className="font-semibold">{t('city.railway', 'Железнодорожный вокзал')}</p>
                    <p className="text-sm text-gray-400">
                      {t('city.railwayDesc', 'Поезда из всех крупных городов Казахстана')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">🚗</span>
                  <div>
                    <p className="font-semibold">{t('city.highway', 'Автодорога')}</p>
                    <p className="text-sm text-gray-400">
                      {t('city.highwayDesc', 'Трасса M39 связывает с Алматы и Ташкентом')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195987.81546623572!2d65.35!3d44.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41f643e1e90e9b0b%3A0x57c1d3c49d89e8e!2sKyzylorda%2C%20Kazakhstan!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default CityPage;

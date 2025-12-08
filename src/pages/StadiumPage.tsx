import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import {
  Users,
  Car,
  Lightbulb,
  Monitor,
  Shield,
  Accessibility,
  MapPin,
  Trophy,
  Thermometer,
  Droplets,
} from 'lucide-react';

const StadiumPage = () => {
  const features = [
    {
      icon: Users,
      title: '11 000',
      subtitle: 'зрителей',
      description: 'Вместимость превышает минимальные требования УЕФА на 3 000 мест',
    },
    {
      icon: Trophy,
      title: '4-я категория',
      subtitle: 'УЕФА',
      description: 'Способен принимать матчи группового этапа Лиги чемпионов',
    },
    {
      icon: Car,
      title: '500-700',
      subtitle: 'парковочных мест',
      description: 'Удобная транспортная развязка с заездом и выездом с 6 улиц',
    },
    {
      icon: Lightbulb,
      title: '2000+ люкс',
      subtitle: 'освещение',
      description: 'Philips ArenaVision — трансляции в формате 4K',
    },
    {
      icon: Monitor,
      title: 'LED-экраны',
      subtitle: 'как на ЧМ-2022',
      description: 'Оборудование от поставщика стадионов чемпионата мира в Катаре',
    },
    {
      icon: Shield,
      title: 'Skidata',
      subtitle: 'турникеты',
      description: 'Австрийская система безопасности — одна из лучших в мире',
    },
    {
      icon: Accessibility,
      title: 'VIP и SkyBox',
      subtitle: '5+ кабин',
      description: 'Зоны для инвалидов с подъёмными лифтами',
    },
  ];

  const fieldFeatures = [
    {
      icon: Trophy,
      title: 'Сертификат ФИФА',
      description: 'Поле сертифицировано как на «Астана Арене»',
    },
    {
      icon: Droplets,
      title: 'FieldTurf',
      description: 'Мировой лидер синтетических покрытий — ворс 6 см',
    },
    {
      icon: Thermometer,
      title: 'Подогрев REHAU',
      description: 'Система подогрева по стандартам ведущих европейских стадионов',
    },
    {
      icon: Droplets,
      title: 'Полив Perrot',
      description: 'Немецкая система полива',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80')`,
          }}
        />
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold uppercase tracking-wider mb-6">
              Домашняя арена
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-4">
              Кайсар
              <span className="text-red-500"> Арена</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Современный центр футбольной жизни региона
            </p>
          </motion.div>
        </div>
      </section>

      {/* UEFA Category Badge */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
            <Trophy className="w-16 h-16 text-white" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">4-я категория УЕФА</h2>
              <p className="text-lg text-white/80">
                Способен принимать матчи группового этапа Лиги чемпионов и отборочные игры
                национальной сборной
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">Характеристики</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Один из лучших спортивных объектов в Центральной Азии
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-red-500 mb-4" />
                <div className="text-3xl font-black text-white mb-1">{feature.title}</div>
                <div className="text-sm text-red-400 font-semibold uppercase tracking-wider mb-3">
                  {feature.subtitle}
                </div>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Field Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">Футбольное поле</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Сертифицированное покрытие мирового уровня
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fieldFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-500/20 rounded-2xl p-6 text-center"
              >
                <feature.icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10"
          >
            <p className="text-gray-300 text-center">
              Покрытие <span className="text-green-400 font-bold">FieldTurf</span> — мировой лидер в
              области синтетических спортивных покрытий: ворс высотой 6 см, многослойная структура с
              наполнителем из кварцевого песка и резиновой крошки английского производства.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">Как добраться</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <MapPin className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Адрес</h3>
              <p className="text-gray-300 mb-4">г. Кызылорда, Казахстан</p>
              <div className="space-y-3 text-gray-400">
                <p>• Удобная транспортная развязка</p>
                <p>• Заезд и выезд с 6 улиц города</p>
                <p>• 500-700 парковочных мест</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48996.95386655893!2d65.47!3d44.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41f643e1e90e9b0b%3A0x57c1d3c49d89e8e!2sKyzylorda%2C%20Kazakhstan!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="300"
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

      {/* Infrastructure Note */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-lg text-gray-300">
              Дополняет инфраструктуру города строительство трёх пятизвёздочных гостиниц, включая
              <span className="text-yellow-400 font-bold"> «Rixos»</span>, что создаёт полноценную
              инфраструктуру для приёма болельщиков и делегаций.
            </p>
            <p className="text-gray-400 mt-4">
              Высокие стандарты безопасности, комфорта и технического оснащения делают «Кайсар
              Арену» одним из лучших спортивных объектов в Центральной Азии и новым символом
              модернизации казахстанского футбола.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StadiumPage;

import { PageWrapper } from '@/components/website/PageWrapper';
import { motion } from 'framer-motion';
import {
  Users,
  Car,
  Lightbulb,
  Monitor,
  Shield,
  Accessibility,
  Trophy,
  Thermometer,
  Droplets,
  Camera,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

const StadiumPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const stadiumPhotos = [
    '/images/stadium/IMG_9947.JPG',
    '/images/stadium/IMG_9742.JPG',
    '/images/stadium/IMG_9743.JPG',
    '/images/stadium/stadium-night.jpg',
    '/images/stadium/IMG_9966.JPG',
    '/images/stadium/IMG_9643.JPG',
    '/images/stadium/stadium-field.jpg',
    '/images/stadium/IMG_9967.WEBP',
  ];

  const features = [
    {
      icon: Users,
      title: '11 000',
      subtitle: t('stadium.spectators', 'зрителей'),
      description: t(
        'stadium.capacityDesc',
        'Вместимость превышает минимальные требования УЕФА на 3 000 мест'
      ),
    },
    {
      icon: Trophy,
      title: t('stadium.categoryValue', '4-я категория'),
      subtitle: t('stadium.uefa', 'УЕФА'),
      description: t(
        'stadium.categoryDesc',
        'Способен принимать матчи группового этапа Лиги чемпионов'
      ),
    },
    {
      icon: Car,
      title: '500-700',
      subtitle: t('stadium.parkingSpots', 'парковочных мест'),
      description: t(
        'stadium.parkingDesc',
        'Удобная транспортная развязка с заездом и выездом с 6 улиц'
      ),
    },
    {
      icon: Lightbulb,
      title: '2000+ люкс',
      subtitle: t('stadium.lightingLabel', 'освещение'),
      description: t('stadium.lightingDescFull', 'Philips ArenaVision — трансляции в формате 4K'),
    },
    {
      icon: Monitor,
      title: t('stadium.ledScreens', 'LED-экраны'),
      subtitle: t('stadium.ledScreensDesc', 'как на ЧМ-2022'),
      description: t(
        'stadium.ledScreensDescFull',
        'Оборудование от поставщика стадионов чемпионата мира в Катаре'
      ),
    },
    {
      icon: Shield,
      title: 'Skidata',
      subtitle: t('stadium.turnstiles', 'турникеты'),
      description: t(
        'stadium.turnstilesDescFull',
        'Австрийская система безопасности — одна из лучших в мире'
      ),
    },
    {
      icon: Accessibility,
      title: t('stadium.vip', 'VIP и SkyBox'),
      subtitle: t('stadium.vipCabins', '5+ кабин'),
      description: t('stadium.accessibilityDescFull', 'Зоны для инвалидов с подъёмными лифтами'),
    },
  ];

  const fieldFeatures = [
    {
      icon: Trophy,
      title: t('stadium.fifaCertificate', 'Сертификат ФИФА'),
      description: t('stadium.fifaCertificateDesc', 'Поле сертифицировано как на «Астана Арене»'),
    },
    {
      icon: Droplets,
      title: 'FieldTurf',
      description: t('stadium.fieldTurfDesc', 'Мировой лидер синтетических покрытий — ворс 6 см'),
    },
    {
      icon: Thermometer,
      title: t('stadium.heatingRehau', 'Подогрев REHAU'),
      description: t(
        'stadium.heatingDesc',
        'Система подогрева по стандартам ведущих европейских стадионов'
      ),
    },
    {
      icon: Droplets,
      title: t('stadium.wateringPerrot', 'Полив Perrot'),
      description: t('stadium.wateringDesc', 'Немецкая система полива'),
    },
  ];

  const faqItems = [
    {
      value: 'item-1',
      question: t('stadium.faq.tickets.q', 'Как купить билеты?'),
      answer: t(
        'stadium.faq.tickets.a',
        'Билеты можно купить онлайн на нашем сайте или в кассах стадиона в день матча. Продажа открывается за 3 дня до игры.'
      ),
    },
    {
      value: 'item-2',
      question: t('stadium.faq.parking.q', 'Есть ли парковка на стадионе?'),
      answer: t(
        'stadium.faq.parking.a',
        'Да, стадион располагает парковкой на 700 мест. Доступна с 6 улиц. Рекомендуем приезжать за час до матча, чтобы занять удобное место.'
      ),
    },
    {
      value: 'item-3',
      question: t('stadium.faq.food.q', 'Можно ли проносить еду и напитки?'),
      answer: t(
        'stadium.faq.food.a',
        'Пронос своей еды и напитков запрещен в целях безопасности. На территории стадиона работают фудкорты с широким выбором еды и напитков.'
      ),
    },
    {
      value: 'item-4',
      question: t('stadium.faq.kids.q', 'Нужен ли билет для ребенка?'),
      answer: t(
        'stadium.faq.kids.a',
        'Детям до 7 лет вход бесплатный без предоставления отдельного места (на руках у родителей). Для детей старше 7 лет необходимо приобретать детский билет.'
      ),
    },
    {
      value: 'item-5',
      question: t('stadium.faq.items.q', 'Что запрещено проносить на стадион?'),
      answer: t(
        'stadium.faq.items.a',
        'Запрещено проносить оружие, пиротехнику, стеклянную тару, алкоголь, профессиональную фото-видео технику без аккредитации.'
      ),
    },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative h-[clamp(350px,70vh,90vh)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            poster="/images/hero-poster.jpg"
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-main.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-20 text-center px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold uppercase tracking-wider mb-6">
              {t('stadium.homeArena', 'Домашняя арена')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-4">
              {t('stadium.kaisar', 'Кайсар')}
              <span className="text-red-500"> {t('stadium.arena', 'Арена')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('stadium.modernCenter', 'Современный центр футбольной жизни региона')}
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
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {t('stadium.uefaCategory', '4-я категория УЕФА')}
              </h2>
              <p className="text-lg text-white/80">
                {t(
                  'stadium.uefaCategoryDesc',
                  'Способен принимать матчи группового этапа Лиги чемпионов и отборочные игры национальной сборной'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('stadium.photoGallery', 'Фотогалерея')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('stadium.photoGalleryDesc', 'Современная арена мирового уровня')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stadiumPhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? 0 : index * 0.1 }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => setSelectedImage(photo)}
              >
                <img
                  src={photo}
                  alt={`Кайсар Арена ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={isMobile ? { scale: 1 } : { scale: 0.8 }}
            animate={{ scale: 1 }}
            src={selectedImage}
            alt="Кайсар Арена"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-red-500 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('stadium.specifications', 'Характеристики')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t(
                'stadium.bestInCentralAsia',
                'Один из лучших спортивных объектов в Центральной Азии'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? 0 : index * 0.1 }}
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
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('stadium.footballPitch', 'Футбольное поле')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('stadium.certifiedTurf', 'Сертифицированное покрытие мирового уровня')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fieldFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? 0 : index * 0.1 }}
                className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-500/20 rounded-2xl p-6 text-center"
              >
                <feature.icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10"
          >
            <p className="text-gray-300 text-center">
              {t('stadium.fieldTurfFullDesc', 'Покрытие')}{' '}
              <span className="text-green-400 font-bold">FieldTurf</span> —{' '}
              {t(
                'stadium.fieldTurfDetails',
                'мировой лидер в области синтетических спортивных покрытий: ворс высотой 6 см, многослойная структура с наполнителем из кварцевого песка и резиновой крошки английского производства.'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              {t('stadium.faqTitle', 'Часто задаваемые вопросы')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('stadium.faqSubtitle', 'Ответы на популярные вопросы болельщиков')}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map(item => (
                <AccordionItem key={item.value} value={item.value} className="border-white/10">
                  <AccordionTrigger className="text-xl font-bold hover:text-red-500 hover:no-underline text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-lg">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Infrastructure Note */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-lg text-gray-300">
              {t(
                'stadium.infraNote1',
                'Дополняет инфраструктуру города строительство трёх пятизвёздочных гостиниц, включая'
              )}
              <span className="text-yellow-400 font-bold"> «Rixos»</span>,{' '}
              {t(
                'stadium.infraNote2',
                'что создаёт полноценную инфраструктуру для приёма болельщиков и делегаций.'
              )}
            </p>
            <p className="text-gray-400 mt-4">
              {t(
                'stadium.infraNote3',
                'Высокие стандарты безопасности, комфорта и технического оснащения делают «Кайсар Арену» одним из лучших спортивных объектов в Центральной Азии и новым символом модернизации казахстанского футбола.'
              )}
            </p>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default StadiumPage;

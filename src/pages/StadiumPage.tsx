import { PageWrapper } from '@/components/website/PageWrapper';
import { SEO } from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
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
      subtitle: t('stadium.spectators', 'spectators'),
      description: t(
        'stadium.capacityDesc',
        'Capacity exceeds UEFA minimum requirements by 3,000 seats'
      ),
    },
    {
      icon: Trophy,
      title: t('stadium.categoryValue', 'Category 4'),
      subtitle: t('stadium.uefa', 'UEFA'),
      description: t(
        'stadium.categoryDesc',
        'Capable of hosting Champions League group stage matches'
      ),
    },
    {
      icon: Car,
      title: '500-700',
      subtitle: t('stadium.parkingSpots', 'parking spots'),
      description: t(
        'stadium.parkingDesc',
        'Convenient transport interchange with entry/exit from 6 streets'
      ),
    },
    {
      icon: Lightbulb,
      title: '2000+ lux',
      subtitle: t('stadium.lightingLabel', 'lighting'),
      description: t('stadium.lightingDescFull', 'Philips ArenaVision — 4K broadcasting'),
    },
    {
      icon: Monitor,
      title: t('stadium.ledScreens', 'LED Screens'),
      subtitle: t('stadium.ledScreensDesc', 'like at WC-2022'),
      description: t(
        'stadium.ledScreensDescFull',
        'Equipment from World Cup Qatar stadium supplier'
      ),
    },
    {
      icon: Shield,
      title: 'Skidata',
      subtitle: t('stadium.turnstiles', 'turnstiles'),
      description: t(
        'stadium.turnstilesDescFull',
        'Austrian security system — one of the best in the world'
      ),
    },
    {
      icon: Accessibility,
      title: t('stadium.vip', 'VIP & SkyBox'),
      subtitle: t('stadium.vipCabins', '5+ cabins'),
      description: t('stadium.accessibilityDescFull', 'Areas for disabled people with elevators'),
    },
  ];

  const fieldFeatures = [
    {
      icon: Trophy,
      title: t('stadium.fifaCertificate', 'FIFA Certificate'),
      description: t('stadium.fifaCertificateDesc', 'Field certified like Astana Arena'),
    },
    {
      icon: Droplets,
      title: 'FieldTurf',
      description: t('stadium.fieldTurfDesc', 'Global leader in synthetic turf — 6cm pile height'),
    },
    {
      icon: Thermometer,
      title: t('stadium.heatingRehau', 'REHAU Heating'),
      description: t(
        'stadium.heatingDesc',
        'Heating system according to leading European stadium standards'
      ),
    },
    {
      icon: Droplets,
      title: t('stadium.wateringPerrot', 'Perrot Watering'),
      description: t('stadium.wateringDesc', 'German watering system'),
    },
  ];

  const faqItems = [
    {
      value: 'item-1',
      question: t('stadium.faq.tickets.q', 'How to buy tickets?'),
      answer: t(
        'stadium.faq.tickets.a',
        'Tickets can be purchased online on our website or at the stadium box office on match day.'
      ),
    },
    {
      value: 'item-2',
      question: t('stadium.faq.parking.q', 'Is there parking?'),
      answer: t('stadium.faq.parking.a', 'Yes, parking for 700 cars is available.'),
    },
    {
      value: 'item-3',
      question: t('stadium.faq.food.q', 'Can I bring food?'),
      answer: t(
        'stadium.faq.food.a',
        'Outside food and drinks are prohibited. Food courts are available inside.'
      ),
    },
  ];

  return (
    <PageWrapper>
      <SEO title="Стадион" description="Стадион ФК Кайсар — информация и фото" path="/stadium" />
      <main className="min-h-screen bg-[hsl(222,47%,11%)]">
        {/* Hero Section */}
        <section className="relative h-[clamp(350px,70vh,90vh)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[hsl(222,47%,11%)] z-10" />
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
          <div className="relative z-20 text-center px-4 pt-20">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-red-600 text-white font-mono text-xs uppercase tracking-widest mb-6">
                {t('stadium.homeArena', 'Home Arena')}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl font-display uppercase tracking-tighter mb-4 text-white leading-none">
                {t('stadium.kaisar', 'Kaisar')}
                <span className="text-red-500"> {t('stadium.arena', 'Arena')}</span>
              </h1>
              <p className="font-mono text-sm md:text-base text-gray-300 max-w-3xl mx-auto uppercase tracking-wider">
                {t('stadium.modernCenter', 'Modern sports facility of the region')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* UEFA Category Badge */}
        <section className="py-12 bg-red-900/20 border-y border-red-900/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
              <Trophy className="w-16 h-16 text-white" />
              <div>
                <h2 className="text-3xl md:text-5xl font-display uppercase text-white mb-2">
                  {t('stadium.uefaCategory', 'UEFA Category 4')}
                </h2>
                <p className="text-lg text-white/60 font-mono">
                  {t(
                    'stadium.uefaCategoryDesc',
                    'Capable of hosting Champions League group stage matches'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="py-20 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
                {t('stadium.photoGallery', 'Photo Gallery')}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px md:gap-1">
              {stadiumPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(photo)}
                >
                  <img
                    src={photo}
                    alt={`Stadium ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
              onClick={() => setSelectedImage(null)}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={selectedImage}
                alt="Overview"
                className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              />
              <button
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
                {t('stadium.specifications', 'Specifications')}
              </h2>
              <p className="font-mono text-white/50 text-sm uppercase tracking-wider">
                {t(
                  'stadium.bestInCentralAsia',
                  'One of the best sports facilities in Central Asia'
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/5 p-4 md:p-6 lg:p-8 hover:bg-white/10 hover:border-red-600/50 transition-all duration-300 group"
                >
                  <feature.icon className="w-10 h-10 text-red-500 mb-6" />
                  <div className="text-4xl font-display text-white mb-1">{feature.title}</div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">
                    {feature.subtitle}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Field Section */}
        <section className="py-20 bg-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
                {t('stadium.footballPitch', 'Football Pitch')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-12">
              {fieldFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[hsl(222,47%,11%)] p-8 text-center hover:bg-white/5 transition-colors group"
                >
                  <feature.icon className="w-12 h-12 text-green-500 mx-auto mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-display uppercase text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-wide">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-8 border border-green-500/20 bg-green-900/10 text-center max-w-4xl mx-auto">
              <p className="text-white/80 font-mono text-sm leading-relaxed">
                <span className="text-green-500 font-bold">FieldTurf</span> —{' '}
                {t('stadium.fieldTurfFullDesc', 'Покрытие')}{' '}
                {t(
                  'stadium.fieldTurfDetails',
                  'мировой лидер в области синтетических спортивных покрытий: ворс высотой 6 см, многослойная структура с наполнителем из кварцевого песка и резиновой крошки английского производства.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
                {t('stadium.faqTitle', 'FAQ')}
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map(item => (
                  <AccordionItem key={item.value} value={item.value} className="border-white/10">
                    <AccordionTrigger className="text-xl font-display uppercase text-white hover:text-red-500 hover:no-underline text-left py-6">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 font-mono text-sm leading-relaxed pb-6">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
};

export default StadiumPage;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Video, Image, Play, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Badge } from '@/components/ui/badge';

const MediaPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'ru' | 'kk' | 'en';

  const labels = {
    ru: {
      title: 'Медиа',
      titleHighlight: 'Центр',
      subtitle: 'Фото и видео материалы ФК Кайсар',
      backToHome: 'На главную',
      photos: 'Фотогалерея',
      videos: 'Видео',
      viewAll: 'Смотреть все',
      comingSoon: 'Видео скоро появятся',
      photoDesc: 'Лучшие моменты матчей и тренировок',
      videoDesc: 'Обзоры матчей, интервью и закулисье',
    },
    kk: {
      title: 'Медиа',
      titleHighlight: 'Орталығы',
      subtitle: 'ФК Қайсар фото және видео материалдары',
      backToHome: 'Басты бетке',
      photos: 'Фотогалерея',
      videos: 'Видео',
      viewAll: 'Барлығын көру',
      comingSoon: 'Видео жақында қосылады',
      photoDesc: 'Матчтар мен жаттығулардың үздік сәттері',
      videoDesc: 'Матч шолулары, сұхбаттар және сахна артында',
    },
    en: {
      title: 'Media',
      titleHighlight: 'Center',
      subtitle: 'Photos and videos of FC Kaisar',
      backToHome: 'Back to Home',
      photos: 'Photo Gallery',
      videos: 'Videos',
      viewAll: 'View all',
      comingSoon: 'Videos coming soon',
      photoDesc: 'Best moments from matches and training',
      videoDesc: 'Match reviews, interviews and behind the scenes',
    },
  };
  const l = labels[lang] || labels.ru;

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      <section className="relative pt-24 pb-12 bg-gradient-to-b from-red-900/20 via-red-900/5 to-black overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,100vw)] h-[min(400px,60vh)] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{l.backToHome}</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-2">
              <Video className="w-10 h-10 text-red-500" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter">
                {l.title} <span className="text-red-500">{l.titleHighlight}</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg md:text-xl">{l.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Photo Gallery Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Camera className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-black uppercase">{l.photos}</h2>
            </div>
            <Link
              to="/gallery"
              className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              {l.viewAll} <ChevronLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
          <p className="text-gray-400 mb-6">{l.photoDesc}</p>
          <Link to="/gallery" className="block group">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-64 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-600" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <Badge className="bg-red-600/20 text-red-400 border-red-600/30 mb-2">
                  <Camera className="w-3 h-3 mr-1" /> {l.photos}
                </Badge>
                <p className="text-white font-bold text-lg group-hover:text-red-500 transition-colors">
                  {l.viewAll} →
                </p>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Videos Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Play className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl md:text-3xl font-black uppercase">{l.videos}</h2>
          </div>
          <p className="text-gray-400 mb-6">{l.videoDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden aspect-video group cursor-pointer hover:border-red-500/50 transition-all"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/40 transition-colors">
                    <Play className="w-8 h-8 text-red-500 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-gray-400 text-sm">{l.comingSoon}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default MediaPage;

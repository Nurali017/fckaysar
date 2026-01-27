import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/website/PageWrapper';
import { SEO } from '@/components/SEO';
import { useTranslation } from 'react-i18next';
import { Camera, Video } from 'lucide-react';

const MediaPage = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'photos',
      title: t('media.photos', 'Photo Gallery'),
      icon: Camera,
      link: '/gallery',
      items: [
        {
          id: 1,
          title: t('media.gallery.title', 'Matchday Gallery'),
          image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Gallery+1',
          count: 12,
        },
        // Add more placeholders if needed
      ],
    },
    {
      id: 'videos',
      title: t('media.videos', 'Videos'),
      icon: Video,
      link: '/videos',
      items: [
        {
          id: 1,
          title: t('media.video.title', 'Match Highlights'),
          image: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Video+1',
          duration: '05:30',
        },
      ],
    },
  ];

  return (
    <PageWrapper>
      <SEO title="Медиа" description="Фото и видео материалы ФК Кайсар" path="/media" />
      <main className="bg-[hsl(222,47%,11%)] min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-2">
              {t('media.title', 'Media Center')}
            </h1>
            <p className="font-mono text-white/50 text-sm md:text-base max-w-2xl">
              {t('media.subtitle', 'Photos and videos of FC Kaisar')}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-20">
            {sections.map(section => (
              <section key={section.id}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-display uppercase text-white flex items-center gap-3">
                    <section.icon className="w-6 h-6 text-red-600" />
                    {section.title}
                  </h2>
                  <Link
                    to={section.link}
                    className="font-mono text-sm text-red-500 hover:text-white transition-colors"
                  >
                    {t('common.viewAll', 'View All')} →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.items.map(item => (
                    <div key={item.id} className="group relative cursor-pointer">
                      <div className="relative aspect-video w-full overflow-hidden bg-white/5 mb-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-[center_10%] transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay Icon */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <section.icon className="w-10 h-10 text-white" />
                        </div>

                        {/* Badge */}
                        <div className="absolute top-0 left-0 bg-red-600 px-2 py-1">
                          <span className="text-white text-[10px] font-mono font-bold">
                            {item.count ? `${item.count} Photos` : item.duration}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-display uppercase text-white group-hover:text-red-500 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default MediaPage;

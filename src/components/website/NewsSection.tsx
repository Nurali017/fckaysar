import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRegularNews } from '@/hooks/api/useNews';

export const NewsSection = () => {
  const { t, i18n } = useTranslation();
  // Fetch regular (non-featured) news for the grid
  const { data: news = [], isLoading } = useRegularNews(4);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(
      i18n.language === 'en' ? 'en-US' : i18n.language === 'ru' ? 'ru-RU' : 'kk-KZ',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    ).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12 lg:py-20 px-4 md:px-8 max-w-[1440px] mx-auto border-t border-white/5">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-display uppercase text-white">
          {t('media.title', 'Media')}
        </h2>
        <Link
          to="/news"
          className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors pb-1"
        >
          <span className="font-mono text-xs uppercase tracking-wider">
            {t('media.viewAll', 'View All')}
          </span>
          <div className="w-6 h-6 bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {news.map(item => (
          <Link to={`/news/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-red-600 text-white text-[10px] font-mono font-bold uppercase px-2 py-1 tracking-wide">
                  {item.category || 'News'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <span className="text-white/40 font-mono text-xs">
                {formatDate(item.publishedAt)}
              </span>
              <h3 className="text-xl md:text-2xl font-display uppercase leading-tight text-white group-hover:text-red-500 transition-colors line-clamp-3">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

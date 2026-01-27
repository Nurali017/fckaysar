import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { PageWrapper } from '@/components/website/PageWrapper';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNews } from '@/hooks/api/useNews';

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  // Fetch more items for the main page
  const { data, isLoading, error } = useNews(1, 20);
  const news = data?.news || [];

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

  return (
    <PageWrapper>
      <SEO title="Новости" description="Последние новости футбольного клуба Кайсар" path="/news" />
      <main className="bg-[hsl(222,47%,11%)] min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-2">
              {t('news.title', 'News')}
            </h1>
            <p className="font-mono text-white/50 text-sm md:text-base max-w-2xl">
              {t('news.subtitle', 'Stay updated with latest club news')}
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center text-center text-white/60 gap-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <p>{t('common.error', 'An error occurred')}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="py-20 text-center text-white/40 font-mono">
              {t('news.noNews', 'No news available')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 lg:gap-y-12">
              {news.map(item => (
                <Link to={`/news/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                      onError={e => {
                        e.currentTarget.src =
                          'https://placehold.co/600x400/1a1a1a/ffffff?text=No+Image';
                      }}
                    />
                    <div className="absolute top-0 left-0 bg-red-600 px-3 py-1">
                      <span className="text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                        {item.category || 'News'}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2">
                    <span className="text-white/40 font-mono text-xs uppercase tracking-wide">
                      {formatDate(item.publishedAt)}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display uppercase leading-tight text-white group-hover:text-red-500 transition-colors line-clamp-3">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
};

export default NewsPage;

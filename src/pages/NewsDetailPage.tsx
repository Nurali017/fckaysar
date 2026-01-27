import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Calendar, Share2, AlertCircle, Loader2 } from 'lucide-react';
import { PageWrapper } from '@/components/website/PageWrapper';
import { SEO } from '@/components/SEO';
import { useNewsBySlug } from '@/hooks/api/useNews';

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: news, isLoading, error } = useNewsBySlug(slug || '');

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
      <PageWrapper>
        <div className="min-h-screen bg-[hsl(222,47%,11%)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !news) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-[hsl(222,47%,11%)] flex flex-col items-center justify-center text-white/60 gap-4">
          <AlertCircle className="w-12 h-12 text-red-600" />
          <p>{t('newsDetail.notFound', 'News article not found')}</p>
          <Link
            to="/news"
            className="text-white hover:text-red-500 underline decoration-red-500/50 underline-offset-4"
          >
            {t('newsDetail.backToNews', 'Back to News')}
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SEO title="Новости" description="Новости ФК Кайсар" path="/news" />
      <article className="min-h-screen bg-[hsl(222,47%,11%)] pb-20">
        {/* Hero Image — photo right, dark left */}
        <div className="relative h-[40vh] md:h-[60vh] w-full">
          {/* Dark base */}
          <div className="absolute inset-0 bg-[hsl(222,47%,11%)]" />
          {/* Photo on the right */}
          <img
            src={news.imageUrl}
            alt={news.title}
            className="absolute inset-y-0 right-0 w-full md:w-[55%] h-full object-cover object-top"
            onError={e => {
              e.currentTarget.src = 'https://placehold.co/1200x600/1a1a1a/ffffff?text=No+Image';
            }}
          />
          {/* Gradient: dark left to transparent right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,47%,11%)] via-[hsl(222,47%,11%)]/80 md:via-[hsl(222,47%,11%)]/60 to-transparent z-10" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,11%)] via-transparent to-transparent opacity-90 z-10" />
          {/* Mobile overlay */}
          <div className="absolute inset-0 bg-black/30 md:bg-transparent z-10" />

          {/* Back Button (Absolute Top) */}
          <div className="absolute top-24 md:top-32 left-4 md:left-8 z-30">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-mono text-sm uppercase tracking-wider">
                {t('common.back', 'Back')}
              </span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 -mt-20 md:-mt-32 relative z-30">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider">
                {news.category || 'News'}
              </span>
              <div className="flex items-center gap-2 text-white/60 font-mono text-xs uppercase">
                <Calendar className="w-3 h-3" />
                {formatDate(news.publishedAt)}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white leading-[0.9] mb-4">
              {news.title}
            </h1>
          </header>

          {/* Body Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {/* Excerpt */}
            {news.excerpt && (
              <p className="text-xl md:text-2xl text-white/80 font-display uppercase leading-normal mb-8 border-l-4 border-red-600 pl-6">
                {news.excerpt}
              </p>
            )}

            {/* Main Text */}
            <div className="font-mono text-white/70 text-base md:text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
              {news.content}
            </div>
          </div>

          {/* Footer / Share */}
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
            <Link
              to="/news"
              className="text-white hover:text-red-500 font-display uppercase text-xl transition-colors"
            >
              ← {t('newsDetail.moreNews', 'More News')}
            </Link>
            <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
              <span className="font-mono text-xs uppercase tracking-wider">
                {t('common.share', 'Share')}
              </span>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    </PageWrapper>
  );
};

export default NewsDetailPage;

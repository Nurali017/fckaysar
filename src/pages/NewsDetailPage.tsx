import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Tag, Share2, AlertCircle, Loader2 } from 'lucide-react';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNewsBySlug } from '@/hooks/api/useNews';
import { useIsMobile } from '@/hooks/useIsMobile';

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: news, isLoading, error } = useNewsBySlug(slug || '');
  const lang = i18n.language as 'ru' | 'kk' | 'en';
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed - this is expected behavior
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <WebsiteHeader />

      <main className="pt-20">
        {/* Loading State */}
        {isLoading && (
          <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-gray-400">{t('newsDetail.loading')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="container mx-auto px-4 py-16">
            <Alert className="bg-red-500/10 border-red-500/20 max-w-2xl mx-auto">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="text-white ml-2">
                {t('newsDetail.errorLoading')}
              </AlertDescription>
            </Alert>
            <div className="text-center mt-8">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t('newsDetail.backToNews')}
              </Button>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {!isLoading && !error && !news && (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('newsDetail.notFound')}</h1>
              <p className="text-gray-400 mb-8">{t('newsDetail.notFoundDesc')}</p>
              <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t('newsDetail.backToNews')}
              </Button>
            </div>
          </div>
        )}

        {/* News Content */}
        {news && !isLoading && (
          <>
            {/* Hero Section */}
            <section className="relative">
              {/* Back Button */}
              <div className="container mx-auto px-4 py-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('newsDetail.backToNews')}</span>
                </Link>
              </div>

              {/* Featured Image */}
              {news.imageUrl && (
                <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                  <motion.img
                    initial={isMobile ? { opacity: 1 } : { scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: isMobile ? 0 : 0.8 }}
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.src = '/placeholder.svg';
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
              )}

              {/* Title & Meta */}
              <div className="container mx-auto px-4 -mt-32 relative z-20">
                <motion.div
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isMobile ? 0 : 0.6, delay: isMobile ? 0 : 0.2 }}
                  className="max-w-4xl"
                >
                  {news.category && (
                    <Badge className="bg-red-600 mb-4 text-sm px-3 py-1">
                      {news.category.toUpperCase()}
                    </Badge>
                  )}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                    {news.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm md:text-base mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(news.publishedAt)}</span>
                    </div>
                    {navigator.share && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShare}
                        className="text-gray-400 hover:text-white"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {t('newsDetail.share')}
                      </Button>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Article Content */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <motion.article
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isMobile ? 0 : 0.6, delay: isMobile ? 0 : 0.4 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* Excerpt */}
                  {news.excerpt && (
                    <div className="text-xl md:text-2xl text-gray-300 mb-8 pb-8 border-b border-white/10 font-light leading-relaxed">
                      {news.excerpt}
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {news.content}
                    </div>
                  </div>

                  {/* Tags */}
                  {news.tags && news.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-4 text-gray-400">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase">
                          {t('newsDetail.tags')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {news.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-white/20 text-gray-300 hover:bg-white/5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.article>
              </div>
            </section>

            {/* Back to News Button */}
            <section className="py-12 border-t border-white/10">
              <div className="container mx-auto px-4 text-center">
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t('newsDetail.backToNews')}
                </Button>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;

import { memo, useCallback } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNews } from '@/hooks/api/useNews';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  news: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    publishedAt: string;
  };
  index: number;
  formatDate: (date: string) => string;
  readMoreText: string;
}

// Memoized news card to prevent re-renders
const NewsCard = memo(({ news, index, formatDate, readMoreText }: NewsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <Link to={`/news/${news.slug}`}>
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden group cursor-pointer h-full">
        <CardHeader className="p-0">
          <div className="relative aspect-video sm:aspect-square overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-news.jpg';
                e.currentTarget.onerror = null;
              }}
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <Badge className="bg-red-600 text-white text-xs">{news.category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">{formatDate(news.publishedAt)}</p>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">{news.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 sm:line-clamp-3">{news.excerpt}</p>
        </CardContent>
        <CardFooter className="p-4 sm:p-6 pt-0">
          <Button variant="ghost" className="text-red-500 hover:text-red-400 p-0 h-auto text-sm">
            {readMoreText} <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  </motion.div>
));
NewsCard.displayName = 'NewsCard';

export const NewsSection = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useNews(1, 4);

  const newsItems = data?.news || [];

  // Memoized date formatter
  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const locale = i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }, [i18n.language]);

  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-white">
            {t("news.title")}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            {t("news.subtitle")}
          </p>
        </div>
        <Link to="/news">
          <Button variant="outline" className="hidden md:flex border-white/20 text-white hover:bg-white/10 min-h-[44px]">
            {t("news.viewAll")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12 sm:py-20">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-red-500" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12 sm:py-20 text-gray-400 text-sm sm:text-base">
          {t("common.error")}
        </div>
      )}

      {/* News Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newsItems.map((news, index) => (
            <NewsCard
              key={news.id}
              news={news}
              index={index}
              formatDate={formatDate}
              readMoreText={t("news.readMore")}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 sm:mt-8 md:hidden">
        <Link to="/news" className="w-full">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full min-h-[48px]">
            {t("news.viewAll")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

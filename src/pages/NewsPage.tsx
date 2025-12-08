import { Link } from 'react-router-dom';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Newspaper, AlertCircle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNews } from '@/hooks/api/useNews';

const NewsPage = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = useNews(1, 20);
  const news = data?.news || [];
  const lang = i18n.language as 'ru' | 'kk' | 'en';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <WebsiteHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 via-black to-black" />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-red-600/20 text-red-400 border-red-600/30 mb-4">
                <Newspaper className="w-4 h-4 mr-2" />
                {lang === 'kk' ? 'Жаңалықтар' : lang === 'en' ? 'News' : 'Новости'}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {lang === 'kk' ? 'Барлық' : lang === 'en' ? 'All' : 'Все'}
                </span>
                <br />
                <span className="text-red-500">
                  {lang === 'kk' ? 'Жаңалықтар' : lang === 'en' ? 'News' : 'Новости'}
                </span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full bg-gray-800" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      <Skeleton className="h-3 w-full bg-gray-800" />
                      <Skeleton className="h-3 w-2/3 bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-white">
                  {lang === 'kk'
                    ? 'Жаңалықтарды жүктеу мүмкін болмады'
                    : lang === 'en'
                      ? 'Failed to load news'
                      : 'Не удалось загрузить новости'}
                </AlertDescription>
              </Alert>
            ) : news.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">
                  {lang === 'kk'
                    ? 'Жаңалықтар жоқ'
                    : lang === 'en'
                      ? 'No news available'
                      : 'Новостей пока нет'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                  <Link key={item.id} to={`/news/${item.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all cursor-pointer h-full"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={item.imageUrl || '/placeholder.svg'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => {
                            e.currentTarget.src = '/placeholder.svg';
                            e.currentTarget.onerror = null;
                          }}
                        />
                        {item.category && (
                          <Badge className="absolute top-3 left-3 bg-red-600">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.publishedAt)}
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3">{item.excerpt}</p>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;

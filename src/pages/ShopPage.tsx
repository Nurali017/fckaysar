import { useState } from 'react';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Filter, Grid3X3, LayoutGrid, MapPin, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  mockProducts,
  categoryLabels,
  formatPrice,
  type Product,
  type ProductCategory,
} from '@/data/shopData';
import { useIsMobile } from '@/hooks/useIsMobile';

const ShopPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [gridCols, setGridCols] = useState<2 | 3>(3);
  const isMobile = useIsMobile();

  const currentLang = i18n.language as 'ru' | 'kk' | 'en';

  const filteredProducts =
    selectedCategory === 'all'
      ? mockProducts
      : mockProducts.filter(p => p.category === selectedCategory);

  const categories: (ProductCategory | 'all')[] = [
    'all',
    'jerseys',
    'training',
    'accessories',
    'kids',
  ];

  const getCategoryLabel = (cat: ProductCategory | 'all'): string => {
    if (cat === 'all') {
      return currentLang === 'kk' ? 'Барлығы' : currentLang === 'en' ? 'All' : 'Все';
    }
    return categoryLabels[cat][currentLang] || categoryLabels[cat].ru;
  };

  const getProductName = (product: Product): string => {
    switch (currentLang) {
      case 'kk':
        return product.nameKz;
      case 'en':
        return product.nameEn;
      default:
        return product.name;
    }
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
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.6 }}
            >
              <Badge className="bg-red-600/20 text-red-400 border-red-600/30 mb-4">
                {t('shop.official', 'Official Store')}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  FC KAISAR
                </span>
                <br />
                <span className="text-red-500">{t('shop.title', 'Магазин')}</span>
              </h1>

              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                {t('shop.subtitle', 'Официальная атрибутика и экипировка ФК Кайсар')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Banner */}
        <section className="px-4 -mt-8 relative z-20">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.6, delay: isMobile ? 0 : 0.2 }}
              className="bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('shop.comingSoonTitle', 'Онлайн-магазин скоро откроется!')}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {t(
                      'shop.comingSoonBanner',
                      'Мы готовим для вас удобную систему онлайн-заказов. А пока вы можете приобрести атрибутику в нашем магазине на стадионе.'
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span>Стадион «Гани Муратбаев», Кызылорда</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span>Пн-Сб: 10:00 - 18:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={
                      selectedCategory === cat
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'border-gray-700 hover:border-gray-600'
                    }
                  >
                    {getCategoryLabel(cat)}
                  </Button>
                ))}
              </div>

              {/* Grid Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGridCols(2)}
                  className={gridCols === 2 ? 'text-white' : 'text-gray-500'}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGridCols(3)}
                  className={gridCols === 3 ? 'text-white' : 'text-gray-500'}
                >
                  <Grid3X3 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Products Count */}
            <p className="text-sm text-gray-500 mb-6">
              {t('shop.productsCount', 'Товаров')}: {filteredProducts.length}
            </p>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                gridCols === 3
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  getProductName={getProductName}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  index: number;
  getProductName: (product: Product) => string;
}

const ProductCard = ({ product, index, getProductName }: ProductCardProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isMobile ? 0 : 0.4, delay: isMobile ? 0 : index * 0.05 }}
      className="group relative bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={getProductName(product)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-green-600 hover:bg-green-600">{t('shop.new', 'New')}</Badge>
          )}
          {product.isSale && (
            <Badge className="bg-red-600 hover:bg-red-600">{t('shop.sale', 'Sale')}</Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">
              {t('shop.outOfStock', 'Нет в наличии')}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
          {getProductName(product)}
        </h3>

        {/* Sizes */}
        {product.sizes && (
          <p className="text-xs text-gray-500 mb-3">
            {t('shop.sizes', 'Размеры')}: {product.sizes.join(', ')}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Button */}
        <Button
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => {
            toast.info(
              t(
                'shop.toastMessage',
                'Онлайн-заказы скоро будут доступны! Приходите в наш магазин на стадионе.'
              ),
              {
                duration: 4000,
              }
            );
          }}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {t('shop.viewProduct', 'Подробнее')}
        </Button>
      </div>
    </motion.div>
  );
};

export default ShopPage;

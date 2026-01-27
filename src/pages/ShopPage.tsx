import { useState } from 'react';

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
import { PageWrapper } from '@/components/website/PageWrapper';
import { SEO } from '@/components/SEO';
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
    <PageWrapper>
      <SEO title="Магазин" description="Официальный магазин ФК Кайсар" path="/shop" />
      <main className="min-h-screen bg-[hsl(222,47%,11%)] pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-[hsl(222,47%,11%)]" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0 : 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-red-600/20 text-red-500 border border-red-600/20 font-mono text-xs uppercase tracking-widest mb-6">
                {t('shop.official', 'Official Store')}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-display uppercase tracking-tighter mb-4 text-white leading-none">
                FC KAISAR <span className="text-red-600">{t('shop.title', 'Shop')}</span>
              </h1>
              <p className="font-mono text-white/50 text-sm md:text-base max-w-xl mx-auto uppercase tracking-wider">
                {t('shop.subtitle', 'Official merchandise and equipment')}
              </p>
            </motion.div>
          </div>
        </section>
        {/* Coming Soon Banner */}
        <section className="px-4 -mt-8 relative z-20 mb-12">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-[#0f172a] border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-display uppercase text-white mb-2">
                    {t('shop.comingSoonTitle', 'Online Store Coming Soon')}
                  </h3>
                  <p className="text-white/60 text-sm font-mono mb-4 leading-relaxed">
                    {t(
                      'shop.comingSoonBanner',
                      'We are preparing a convenient online ordering system. For now, you can purchase merchandise at our stadium store.'
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-xs font-mono uppercase text-white/40 tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>Gani Muratbayev Stadium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>Mon-Sat: 10:00 - 18:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Filters & Products */}
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-red-500 mr-2" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 md:px-4 text-xs font-mono uppercase tracking-wider transition-all border ${
                      selectedCategory === cat
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-transparent border-white/20 text-white/60 hover:border-white hover:text-white'
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
              {/* Grid Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-2 hover:bg-white/10 ${gridCols === 2 ? 'text-white' : 'text-white/40'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 hover:bg-white/10 ${gridCols === 3 ? 'text-white' : 'text-white/40'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              </div>
            </div>
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
    </PageWrapper>
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
      className="group relative bg-white/5 border border-white/5 hover:border-red-600/50 transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <img
          src={product.image}
          alt={getProductName(product)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-0 left-0 p-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-600 text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">
              {t('shop.new', 'New')}
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">
              {t('shop.sale', 'Sale')}
            </span>
          )}
        </div>
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <span className="text-white font-mono uppercase text-sm tracking-widest border border-white px-4 py-2">
              {t('shop.outOfStock', 'Out of Stock')}
            </span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-display uppercase text-xl text-white mb-1 group-hover:text-red-500 transition-colors leading-none">
            {getProductName(product)}
          </h3>
          {product.sizes && (
            <p className="text-xs font-mono text-white/40">{product.sizes.join(', ')}</p>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-white/40 line-through decoration-red-500">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            className="p-2 bg-white/5 hover:bg-red-600 text-white transition-colors"
            onClick={() => toast.info(t('shop.toastMessage', 'Available at stadium store only'))}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default ShopPage;

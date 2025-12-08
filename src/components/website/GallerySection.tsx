import { memo, useCallback, useState, useEffect } from 'react';
import { ArrowRight, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGallery } from '@/hooks/api/useGallery';

interface GalleryItemProps {
  item: {
    id: string;
    title: string;
    images: string[];
    uploadDate: string;
  };
  index: number;
  formatDate: (date: string) => string;
  onSelect: (index: number) => void;
}

// Memoized gallery item to prevent re-renders
const GalleryItem = memo(({ item, index, formatDate, onSelect }: GalleryItemProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    onClick={() => onSelect(index)}
    className="group relative aspect-square overflow-hidden rounded-lg sm:rounded-xl cursor-pointer"
  >
    <img
      src={item.images[0]}
      alt={item.title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-4">
      <div>
        <p className="text-white font-bold text-xs sm:text-sm mb-1 line-clamp-1">{item.title}</p>
        <p className="text-gray-300 text-[10px] sm:text-xs">{formatDate(item.uploadDate)}</p>
      </div>
    </div>
  </motion.div>
));
GalleryItem.displayName = 'GalleryItem';

export const GallerySection = () => {
  const { t, i18n } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { data, isLoading, isError } = useGallery(1, 8);

  const galleryItems = data?.items || [];
  const itemsLength = galleryItems.length;

  // Memoized navigation handlers
  const goToPrevious = useCallback(() => {
    setSelectedIndex(prev => (prev !== null && prev > 0 ? prev - 1 : itemsLength - 1));
  }, [itemsLength]);

  const goToNext = useCallback(() => {
    setSelectedIndex(prev => (prev !== null && prev < itemsLength - 1 ? prev + 1 : 0));
  }, [itemsLength]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') goToPrevious();
      else if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'Escape') closeLightbox();
    },
    [selectedIndex, goToPrevious, goToNext, closeLightbox]
  );

  useEffect(() => {
    if (selectedIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex, handleKeyDown]);

  // Memoized date formatter
  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const locale = i18n.language === 'kk' ? 'kk-KZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
  }, [i18n.language]);

  // Don't render if error or no data
  if (isError || (!isLoading && galleryItems.length === 0)) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-white">
            {t("gallery.title")}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            {t("gallery.subtitle")}
          </p>
        </div>
        <Link to="/gallery">
          <Button variant="outline" className="hidden md:flex border-white/20 text-white hover:bg-white/10 min-h-[44px]">
            {t("gallery.viewAll")}
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

      {/* Gallery Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {galleryItems.map((item, index) => (
            <GalleryItem
              key={item.id}
              item={item}
              index={index}
              formatDate={formatDate}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="flex justify-center mt-6 sm:mt-8 md:hidden">
        <Link to="/gallery" className="w-full">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full min-h-[48px]">
            {t("gallery.viewAll")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && galleryItems[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 text-white text-xs sm:text-sm font-medium">
              {selectedIndex + 1} / {galleryItems.length}
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl max-h-[85vh] px-4 sm:px-8 md:px-12 lg:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryItems[selectedIndex].images[0]}
                alt={galleryItems[selectedIndex].title}
                className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
              />
              {/* Image Info */}
              <div className="mt-3 sm:mt-4 text-center">
                <p className="text-white font-bold text-base sm:text-lg">{galleryItems[selectedIndex].title}</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {formatDate(galleryItems[selectedIndex].uploadDate)}
                </p>
              </div>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

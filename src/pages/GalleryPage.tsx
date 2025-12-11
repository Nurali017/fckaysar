import { useState } from 'react';
import { PageWrapper } from '@/components/website/PageWrapper';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Camera, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGallery } from '@/hooks/api/useGallery';
import { useIsMobile } from '@/hooks/useIsMobile';

const GalleryPage = () => {
  const { i18n } = useTranslation();
  const { data: gallery = [], isLoading, error } = useGallery(1, 50);
  const lang = i18n.language as 'ru' | 'kk' | 'en';
  const isMobile = useIsMobile();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex !== null && selectedIndex < gallery.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <PageWrapper>
      <main className="pt-20" onKeyDown={handleKeyDown} tabIndex={0}>
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
                <Camera className="w-4 h-4 mr-2" />
                {lang === 'kk' ? 'Галерея' : lang === 'en' ? 'Gallery' : 'Галерея'}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {lang === 'kk' ? 'Фото' : lang === 'en' ? 'Photo' : 'Фото'}
                </span>
                <br />
                <span className="text-red-500">
                  {lang === 'kk' ? 'Галерея' : lang === 'en' ? 'Gallery' : 'Галерея'}
                </span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl bg-gray-800" />
                ))}
              </div>
            ) : error ? (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-white">
                  {lang === 'kk'
                    ? 'Галереяны жүктеу мүмкін болмады'
                    : lang === 'en'
                      ? 'Failed to load gallery'
                      : 'Не удалось загрузить галерею'}
                </AlertDescription>
              </Alert>
            ) : gallery.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">
                  {lang === 'kk'
                    ? 'Суреттер жоқ'
                    : lang === 'en'
                      ? 'No images available'
                      : 'Изображений пока нет'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: isMobile ? 0 : 0.3,
                      delay: isMobile ? 0 : index * 0.03,
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-gray-600 transition-all"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={item.url}
                      alt={item.title || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        <Dialog open={selectedIndex !== null} onOpenChange={() => closeLightbox()}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-white/10">
            <AnimatePresence mode="wait">
              {selectedIndex !== null && gallery[selectedIndex] && (
                <motion.div
                  key={selectedIndex}
                  initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={isMobile ? { opacity: 1 } : { opacity: 0 }}
                  className="relative flex items-center justify-center min-h-[60vh]"
                >
                  <img
                    src={gallery[selectedIndex].url}
                    alt={gallery[selectedIndex].title || 'Gallery image'}
                    className="max-w-full max-h-[85vh] object-contain"
                  />

                  {/* Navigation buttons */}
                  {selectedIndex > 0 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        goPrev();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  {selectedIndex < gallery.length - 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        goNext();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}

                  {/* Close button */}
                  <button
                    onClick={closeLightbox}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-sm">
                    {selectedIndex + 1} / {gallery.length}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </main>
    </PageWrapper>
  );
};

export default GalleryPage;

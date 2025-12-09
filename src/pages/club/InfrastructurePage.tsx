import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { motion } from 'framer-motion';
import {
  Building2,
  Construction,
  MapPin,
  Users,
  Lightbulb,
  Car,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchInfrastructure } from '@/api/cms/infrastructure-service';
import type { InfrastructureItem } from '@/api/cms/types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const StatusBadge = ({ status }: { status: InfrastructureItem['status'] }) => {
  const { t } = useTranslation();
  const statusConfig = {
    active: { label: t('infrastructure.status.active', 'Действующий'), color: 'bg-green-500' },
    construction: {
      label: t('infrastructure.status.construction', 'Строится'),
      color: 'bg-yellow-500',
    },
    planned: { label: t('infrastructure.status.planned', 'Планируется'), color: 'bg-blue-500' },
  };
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${config.color}`}>
      {config.label}
    </span>
  );
};

const InfrastructureCard = ({ item }: { item: InfrastructureItem }) => {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const allImages = item.mainImageUrl ? [item.mainImageUrl, ...item.galleryUrls] : item.galleryUrls;

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImage(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Image Gallery */}
      {allImages.length > 0 && (
        <div className="relative aspect-video group">
          <img
            src={allImages[currentImage]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImage ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute top-4 right-4">
            <StatusBadge status={item.status} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {item.type === 'stadium' ? (
            <Building2 className="w-8 h-8 text-red-500" />
          ) : (
            <Construction className="w-8 h-8 text-red-500" />
          )}
          <h2 className="text-2xl font-black uppercase">{item.name}</h2>
        </div>

        {item.shortDescription && <p className="text-gray-400 mb-4">{item.shortDescription}</p>}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {item.capacity && (
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <Users className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <div className="text-lg font-bold">{item.capacity.toLocaleString()}</div>
              <div className="text-xs text-gray-500">
                {t('infrastructure.capacity', 'Вместимость')}
              </div>
            </div>
          )}
          {item.uefaCategory && (
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-500">UEFA {item.uefaCategory}</div>
              <div className="text-xs text-gray-500">
                {t('infrastructure.category', 'Категория')}
              </div>
            </div>
          )}
          {item.lightingLux && (
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <Lightbulb className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg font-bold">{item.lightingLux.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{t('infrastructure.lux', 'Люкс')}</div>
            </div>
          )}
          {item.parkingSpaces && (
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <Car className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold">{item.parkingSpaces}+</div>
              <div className="text-xs text-gray-500">{t('infrastructure.parking', 'Парковка')}</div>
            </div>
          )}
        </div>

        {/* Features */}
        {item.features.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-gray-400 mb-3">
              {t('infrastructure.features', 'Особенности')}
            </h3>
            <div className="grid gap-2">
              {item.features.map((feature, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-3">
                  <div className="font-semibold text-white">{feature.title}</div>
                  <div className="text-sm text-gray-400">{feature.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {item.description && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-300 whitespace-pre-line">{item.description}</p>
          </div>
        )}

        {/* Address */}
        {item.address && (
          <div className="mt-4 flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{item.address}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const InfrastructurePage = () => {
  const { t } = useTranslation();

  const {
    data: infrastructure,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['infrastructure'],
    queryFn: fetchInfrastructure,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Building2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {t('infrastructure.title', 'Инфраструктура')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('infrastructure.subtitle', 'Стадион, база, академия')}
            </p>
          </motion.div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-red-400">
              {t('common.error', 'Ошибка загрузки данных')}
            </div>
          )}

          {infrastructure && (
            <div className="space-y-12 max-w-4xl mx-auto">
              {infrastructure.map(item => (
                <InfrastructureCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {infrastructure?.length === 0 && !isLoading && (
            <div className="text-center py-20 text-gray-400">
              {t('infrastructure.empty', 'Нет данных об инфраструктуре')}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InfrastructurePage;

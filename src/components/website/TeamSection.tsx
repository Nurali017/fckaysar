import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useHeroPlayer } from '@/hooks/api/useSotaPlayers';
import { PlayerProfile } from './PlayerProfile';
import { useIsMobile } from '@/hooks/useIsMobile';

export const TeamSection = () => {
  const { t } = useTranslation();
  const { data: heroPlayer, isLoading, isError } = useHeroPlayer();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
          {t('team.title')}
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">{t('team.subtitle')}</p>
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
          {t('common.error')}
        </div>
      )}

      {/* Hero Player Display */}
      {!isLoading && !isError && heroPlayer && (
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="group cursor-pointer relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-600/20 via-black to-black border-2 border-red-500/30 hover:border-red-500 transition-all duration-500 shadow-2xl hover:shadow-red-500/20"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 lg:p-12">
              {/* Player Photo */}
              <div className="relative">
                {/* Giant Number Background */}
                <div className="absolute -top-5 sm:-top-10 -right-5 sm:-right-10 text-[100px] sm:text-[150px] md:text-[200px] font-black text-red-500/10 leading-none z-0">
                  {heroPlayer.number}
                </div>

                <div className="relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl border-2 border-red-500/30 z-10">
                  <img
                    src={heroPlayer.photoUrl || '/placeholder.svg'}
                    alt={heroPlayer.name}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/placeholder.svg') {
                        target.src = '/placeholder.svg';
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Player Number Badge */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg">
                    <span className="text-2xl sm:text-3xl font-black">#{heroPlayer.number}</span>
                  </div>
                </div>
              </div>

              {/* Player Info */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                <div>
                  <p className="text-red-500 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">
                    {heroPlayer.position}
                  </p>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-1 sm:mb-2 leading-tight">
                    {heroPlayer.firstName}
                  </h3>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white/80 leading-tight">
                    {heroPlayer.lastName}
                  </h3>
                </div>

                {/* Stats */}
                {heroPlayer.stats && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-500">
                        {heroPlayer.stats.goals || 0}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-400 uppercase mt-1">
                        {t('playerStats.goals')}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-500">
                        {heroPlayer.stats.assists || 0}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-400 uppercase mt-1">
                        {t('playerStats.assists')}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-500">
                        {heroPlayer.stats.appearances || 0}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-400 uppercase mt-1">
                        {t('playerStats.matches')}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-2 text-white/60 group-hover:text-red-500 transition-colors">
                  <span className="text-sm font-medium">{t('team.viewProfile')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* View All Button */}
      <div className="flex justify-center mt-8 sm:mt-12">
        <Link to="/team" className="w-full sm:w-auto px-4 sm:px-0">
          <Button className="bg-white text-black hover:bg-gray-200 font-bold px-6 sm:px-8 min-h-[48px] w-full sm:w-auto">
            {t('team.fullRoster')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Player Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl lg:max-w-7xl max-h-[90vh] sm:max-h-[95vh] overflow-y-auto bg-black border-white/10 p-0">
          {heroPlayer && (
            <motion.div
              initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: isMobile ? 0 : 0.3 }}
            >
              <PlayerProfile playerId={heroPlayer.id} initialData={heroPlayer} />
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

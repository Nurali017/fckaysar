import { useState } from 'react';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Users, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamPlayers } from '@/hooks/api/useSotaPlayers';
import { PlayerProfile } from '@/components/website/PlayerProfile';

type Position = 'all' | 'GK' | 'DEF' | 'MID' | 'FWD';

const TeamPage = () => {
  const { i18n } = useTranslation();
  const { data: players = [], isLoading, error } = useTeamPlayers();
  const lang = i18n.language as 'ru' | 'kk' | 'en';

  const [selectedPosition, setSelectedPosition] = useState<Position>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<typeof players[0] | null>(null);

  const positions: { key: Position; label: Record<string, string> }[] = [
    { key: 'all', label: { ru: 'Все', kk: 'Барлығы', en: 'All' } },
    { key: 'GK', label: { ru: 'Вратари', kk: 'Қақпашылар', en: 'Goalkeepers' } },
    { key: 'DEF', label: { ru: 'Защитники', kk: 'Қорғаушылар', en: 'Defenders' } },
    { key: 'MID', label: { ru: 'Полузащитники', kk: 'Жартылай қорғаушылар', en: 'Midfielders' } },
    { key: 'FWD', label: { ru: 'Нападающие', kk: 'Шабуылшылар', en: 'Forwards' } },
  ];

  const mapPositionKey = (positionKey?: string): Position => {
    switch (positionKey) {
      case 'goalkeeper': return 'GK';
      case 'defender': return 'DEF';
      case 'midfielder': return 'MID';
      case 'forward': return 'FWD';
      default: return 'MID';
    }
  };

  const filteredPlayers = selectedPosition === 'all'
    ? players
    : players.filter((p) => mapPositionKey(p.positionKey) === selectedPosition);

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
                <Users className="w-4 h-4 mr-2" />
                {lang === 'kk' ? 'Команда' : lang === 'en' ? 'Team' : 'Команда'}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {lang === 'kk' ? 'Толық' : lang === 'en' ? 'Full' : 'Полный'}
                </span>
                <br />
                <span className="text-red-500">
                  {lang === 'kk' ? 'Құрам' : lang === 'en' ? 'Squad' : 'Состав'}
                </span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Position Filter */}
        <section className="py-4 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap justify-center gap-2">
              {positions.map((pos) => (
                <Button
                  key={pos.key}
                  variant={selectedPosition === pos.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPosition(pos.key)}
                  className={
                    selectedPosition === pos.key
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'border-gray-700 hover:border-gray-600'
                  }
                >
                  {pos.label[lang] || pos.label.ru}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Players Grid */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl overflow-hidden">
                    <Skeleton className="aspect-[3/4] w-full bg-gray-800" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      <Skeleton className="h-3 w-1/2 bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-white">
                  {lang === 'kk'
                    ? 'Ойыншыларды жүктеу мүмкін болмады'
                    : lang === 'en'
                      ? 'Failed to load players'
                      : 'Не удалось загрузить игроков'}
                </AlertDescription>
              </Alert>
            ) : filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">
                  {lang === 'kk'
                    ? 'Ойыншылар табылмады'
                    : lang === 'en'
                      ? 'No players found'
                      : 'Игроки не найдены'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={player.photoUrl || '/placeholder.svg'}
                        alt={player.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== window.location.origin + '/placeholder.svg') {
                            target.src = '/placeholder.svg';
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {player.number && (
                        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
                          {player.number}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                          {player.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{player.position}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Player Profile Modal */}
        <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-6xl lg:max-w-7xl max-h-[95vh] overflow-y-auto bg-black border-white/10 p-0">
            <AnimatePresence>
              {selectedPlayer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlayerProfile
                    playerId={selectedPlayer.id}
                    initialData={selectedPlayer}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default TeamPage;

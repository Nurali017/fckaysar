import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { PageWrapper } from '@/components/website/PageWrapper';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { useTeamPlayers } from '@/hooks/api/useSotaPlayers';
import { PlayerProfile } from '@/components/website/PlayerProfile';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type Position = 'all' | 'GK' | 'DEF' | 'MID' | 'FWD';

const TeamPage = () => {
  const { t } = useTranslation();
  const { data: players = [], isLoading, error } = useTeamPlayers();

  const [selectedPosition, setSelectedPosition] = useState<Position>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<(typeof players)[0] | null>(null);

  const positions: { key: Position; label: string }[] = [
    { key: 'all', label: t('team.filterAll', 'All') },
    { key: 'GK', label: t('team.filterGK', 'Goalkeepers') },
    { key: 'DEF', label: t('team.filterDEF', 'Defenders') },
    { key: 'MID', label: t('team.filterMID', 'Midfielders') },
    { key: 'FWD', label: t('team.filterFWD', 'Forwards') },
  ];

  const mapPositionKey = (positionKey?: string): Position => {
    switch (positionKey) {
      case 'goalkeeper':
        return 'GK';
      case 'defender':
        return 'DEF';
      case 'midfielder':
        return 'MID';
      case 'forward':
        return 'FWD';
      default:
        return 'MID';
    }
  };

  const filteredPlayers =
    selectedPosition === 'all'
      ? players
      : players.filter(p => mapPositionKey(p.positionKey) === selectedPosition);

  return (
    <PageWrapper>
      <SEO
        title="Команда"
        description="Состав футбольного клуба Кайсар — игроки и позиции"
        path="/team"
      />
      <main className="bg-[hsl(222,47%,11%)] min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-2 leading-none">
                {t('team.heroTitle1', 'Full')}{' '}
                <span className="text-red-600">{t('team.heroTitle2', 'Squad')}</span>
              </h1>
              <p className="font-mono text-white/50 text-sm md:text-base max-w-2xl uppercase tracking-wider">
                {t('team.subtitle', 'First Team Squad 2025')}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {positions.map(pos => (
                <button
                  key={pos.key}
                  onClick={() => setSelectedPosition(pos.key)}
                  className={`px-3 py-2 md:px-4 text-xs md:text-sm font-mono uppercase tracking-wider transition-all border ${
                    selectedPosition === pos.key
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-transparent border-white/20 text-white/60 hover:border-white hover:text-white'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center text-center text-white/60 gap-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <p>{t('team.loadError', 'Failed to load players')}</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="py-20 text-center text-white/40 font-mono">
              {t('team.noPlayers', 'No players found')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPlayers.map(player => (
                <div
                  key={player.id}
                  className="group relative cursor-pointer bg-white/5 border border-white/5 hover:border-red-600/50 transition-colors"
                  onClick={() => setSelectedPlayer(player)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden transition-all duration-500">
                    <img
                      src={player.photoUrl || '/placeholder.svg'}
                      alt={player.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder.svg') {
                          target.src = '/placeholder.svg';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

                    {/* Number Badge */}
                    {player.number && (
                      <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-md px-3 py-2 border-l border-b border-white/10">
                        <span className="text-2xl font-display text-white">{player.number}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <span className="block text-red-500 font-mono text-xs uppercase tracking-wider mb-1">
                      {player.position}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display uppercase text-white leading-none group-hover:text-red-500 transition-colors">
                      {player.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Player Profile Modal */}
        <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-6xl lg:max-w-7xl max-h-[95vh] overflow-y-auto bg-[hsl(222,47%,11%)] border-white/10 p-0 rounded-none sm:rounded-none">
            <AnimatePresence>
              {selectedPlayer && (
                <PlayerProfile playerId={selectedPlayer.id} initialData={selectedPlayer} />
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </main>
    </PageWrapper>
  );
};

export default TeamPage;

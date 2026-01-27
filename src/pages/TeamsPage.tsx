import { PageWrapper } from '@/components/website/PageWrapper';
import { useLeagueStandings } from '@/hooks/api/useStandings';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FC_KAISAR_TEAM_ID } from '@/data/teamLogos';

const TeamsPage = () => {
  const { t } = useTranslation();
  const { data: standings = [], isLoading, error } = useLeagueStandings();

  return (
    <PageWrapper>
      <main className="bg-[hsl(222,47%,11%)] min-h-screen pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-2 leading-none">
              {t('teams.title', 'Teams')}{' '}
              <span className="text-red-600">{t('teams.league', 'Premier League')}</span>
            </h1>
            <p className="font-mono text-white/50 text-sm md:text-base max-w-2xl uppercase tracking-wider">
              {t(
                'teams.subtitle',
                'All participants of the Qazaqstan Premier League 2025. Squads, statistics, and history.'
              )}
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white/5 h-[300px] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center text-center text-white/60 gap-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <p>{t('common.errorLoad', 'Failed to load teams')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {standings.map((team, index) => (
                <Link
                  key={team.teamId}
                  to={`/team/${team.teamId}`}
                  className={`group relative block bg-white/5 border border-white/10 hover:border-red-600/50 transition-all duration-300 ${team.teamId === FC_KAISAR_TEAM_ID ? 'border-red-600/50 bg-red-900/10' : ''}`}
                >
                  {/* Rank Badge */}
                  <div className="absolute top-0 right-0 bg-white/5 px-4 py-2">
                    <span className="font-display text-4xl font-bold text-white/20 group-hover:text-red-500/40 transition-colors">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="p-4 md:p-6 lg:p-8 flex flex-col items-center text-center h-full">
                    <div className="relative mb-8 w-32 h-32 flex items-center justify-center p-4 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                      <img
                        src={team.logo}
                        alt={team.teamName}
                        className="w-full h-full object-contain transition-all duration-500"
                        onError={e => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder-team.svg';
                        }}
                      />
                    </div>

                    <h3 className="text-2xl font-display uppercase text-white mb-2 group-hover:text-red-500 transition-colors">
                      {team.teamName}
                    </h3>

                    <div className="mt-auto pt-6 w-full flex items-center justify-between border-t border-white/5 group-hover:border-red-500/20 transition-colors font-mono text-sm uppercase tracking-wider">
                      <div className="flex flex-col items-start">
                        <span className="text-white/40">{t('teams.games', 'Games')}</span>
                        <span className="text-white">{team.played || 0}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-white/40">{t('teams.points', 'Points')}</span>
                        <span className="text-red-500 font-bold">{team.points || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  );
};

export default TeamsPage;

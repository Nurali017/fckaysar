import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLeagueStandings } from '@/hooks/api/useStandings';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TalentRecommendationModal } from '@/components/website/TalentRecommendationModal';
import { fetchInfrastructure } from '@/api/cms/infrastructure-service';

export const LeagueTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: standings, isLoading } = useLeagueStandings();
  const { data: infrastructure } = useQuery({
    queryKey: ['infrastructure'],
    queryFn: fetchInfrastructure,
  });
  const [showRecommendModal, setShowRecommendModal] = useState(false);

  const academyItem = infrastructure?.find(i => i.type === 'academy');
  const academyImage = academyItem?.mainImageUrl || academyItem?.galleryUrls?.[0];

  // Find Kaysar or highlight logic
  const KAYSAR_IDS = [94, '94']; // Adjust based on real ID

  // Helper to check if row is Kaysar
  const isKaysar = (team: any) => {
    return (
      KAYSAR_IDS.includes(team.teamId) ||
      team.teamName?.toLowerCase().includes('kaysar') ||
      team.teamName?.toLowerCase().includes('кайсар')
    );
  };

  return (
    <section className="py-8 md:py-12 lg:py-20 px-4 md:px-8 max-w-[1440px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
        {/* LEFT COLUMN: STANDINGS TABLE (~65%) */}
        <div className="w-full lg:w-[65%]">
          {/* Header: Tournament Select + All Tables Link */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-4">
            <div className="relative">
              <select className="appearance-none bg-transparent text-white font-display text-xl md:text-2xl uppercase pr-8 cursor-pointer focus:outline-none">
                <option className="bg-[hsl(222,47%,11%)] text-white">
                  Qazaqstan Premier League
                </option>
                {/* Add more options if available */}
              </select>
              <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 text-red-600 w-5 h-5 rotate-90" />
            </div>

            <Link
              to="/statistics"
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <span className="font-mono text-xs uppercase tracking-wider">
                {t('league.allTables', 'All Tables')}
              </span>
              <div className="w-6 h-6 bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/5" />
                ))}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-white/40 font-mono text-xs uppercase border-b border-white/10">
                    <th className="p-1.5 sm:p-3 pl-0 w-10 sm:w-12 text-center">#</th>
                    <th className="p-1.5 sm:p-3">{t('league.club', 'Club')}</th>
                    <th className="p-1.5 sm:p-3 text-center w-10 sm:w-12">M</th>
                    <th className="p-1.5 sm:p-3 text-center w-10 sm:w-12">W</th>
                    <th className="p-1.5 sm:p-3 text-center w-10 sm:w-12 hidden sm:table-cell">
                      D
                    </th>
                    <th className="p-1.5 sm:p-3 text-center w-10 sm:w-12 hidden sm:table-cell">
                      L
                    </th>
                    <th className="p-1.5 sm:p-3 text-center w-16 hidden md:table-cell">+/-</th>
                    <th className="p-1.5 sm:p-3 text-center w-10 sm:w-12 font-bold text-white">
                      P
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm text-white">
                  {(() => {
                    if (!standings || standings.length === 0) return null;
                    const kayIdx = standings.findIndex(isKaysar);
                    const lastIdx = standings.length - 1;
                    // Collect unique indices to show
                    const indices = new Set<number>([0]);
                    if (kayIdx > 0) {
                      indices.add(Math.max(1, kayIdx - 1));
                      indices.add(kayIdx);
                      indices.add(Math.min(kayIdx + 1, lastIdx));
                    }
                    indices.add(lastIdx);
                    const sorted = [...indices].sort((a, b) => a - b);

                    const rows: React.ReactNode[] = [];
                    sorted.forEach((idx, i) => {
                      // Add ellipsis if gap between indices
                      if (i > 0 && idx - sorted[i - 1] > 1) {
                        rows.push(
                          <tr key={`ellipsis-${idx}`} className="border-b border-white/5">
                            <td
                              colSpan={8}
                              className="py-3 text-center text-white/30 text-lg tracking-widest"
                            >
                              • • •
                            </td>
                          </tr>
                        );
                      }
                      const team = standings[idx] as any;
                      const active = isKaysar(team);
                      rows.push(
                        <tr
                          key={team.teamId}
                          className={`border-b border-white/5 transition-colors ${active ? 'bg-red-600/20 hover:bg-red-600/30' : 'hover:bg-white/5'}`}
                        >
                          <td
                            className={`p-1.5 sm:p-3 pl-0 text-center font-bold ${idx < 3 ? 'text-white' : 'text-white/60'}`}
                          >
                            {team.rank}
                          </td>
                          <td className="p-1.5 sm:p-3 flex items-center gap-2 sm:gap-3">
                            <img
                              src={team.logo}
                              alt={team.teamName}
                              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                              onError={e => {
                                e.currentTarget.src =
                                  'https://placehold.co/24x24/transparent/white?text=FC';
                              }}
                            />
                            <span className={active ? 'text-red-500 font-bold' : ''}>
                              {team.teamName}
                            </span>
                          </td>
                          <td className="p-1.5 sm:p-3 text-center">{team.played}</td>
                          <td className="p-1.5 sm:p-3 text-center text-white/60">{team.won}</td>
                          <td className="p-1.5 sm:p-3 text-center text-white/60 hidden sm:table-cell">
                            {team.drawn}
                          </td>
                          <td className="p-1.5 sm:p-3 text-center text-white/60 hidden sm:table-cell">
                            {team.lost}
                          </td>
                          <td className="p-1.5 sm:p-3 text-center text-white/60 hidden md:table-cell">
                            {team.goalsFor - team.goalsAgainst}
                          </td>
                          <td className="p-1.5 sm:p-3 text-center font-bold text-base sm:text-lg">
                            {team.points}
                          </td>
                        </tr>
                      );
                    });
                    return rows;
                  })()}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <Link to="/statistics">
              <Button
                variant="outline"
                className="border-white/20 text-white font-mono uppercase text-xs hover:bg-white/10 rounded-none px-8"
              >
                {t('league.showFullTable', 'Show Full Table')}
              </Button>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR (~35%) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6">
          {/* CTA 1: ACADEMY */}
          <div
            className="group relative flex-1 min-h-[160px] md:min-h-[200px] w-full overflow-hidden bg-zinc-900 cursor-pointer"
            onClick={() => setShowRecommendModal(true)}
          >
            <img
              src={academyImage || '/images/academy-bg.jpg'}
              alt="Academy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-50"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end justify-between">
              <h3 className="text-2xl md:text-3xl font-display text-white uppercase leading-none max-w-[70%]">
                {t('sidebar.academy', 'Join the Academy')}
              </h3>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 flex items-center justify-center transition-colors group-hover:bg-red-500">
                <ArrowRight className="text-white w-6 h-6" />
              </div>
            </div>
          </div>

          {/* CTA 2: STADIUM */}
          <div
            className="group relative flex-1 min-h-[160px] md:min-h-[200px] w-full overflow-hidden bg-zinc-900 cursor-pointer"
            onClick={() => navigate('/stadium')}
          >
            <img
              src="/images/stadium/stadium-night.jpg"
              alt="Stadium"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-50"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end justify-between">
              <h3 className="text-2xl md:text-3xl font-display text-white uppercase leading-none max-w-[70%]">
                {t('sidebar.school', 'Kaysar School')}
              </h3>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 flex items-center justify-center transition-colors group-hover:bg-red-500">
                <ArrowRight className="text-white w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <TalentRecommendationModal
        isOpen={showRecommendModal}
        onClose={() => setShowRecommendModal(false)}
      />
    </section>
  );
};

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import { MatchHero } from '@/components/website/match/MatchHero';
import { MatchTabs, type MatchTab } from '@/components/website/match/MatchTabs';
import { MatchOverview } from '@/components/website/match/MatchOverview';
import { MatchStats } from '@/components/website/match/MatchStats';
import { LineupPitch } from '@/components/website/match/LineupPitch';

import { useMatchDetails } from '@/hooks/api/useMatchDetails';

const MatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MatchTab>('overview');

  const { data: match, isLoading, error } = useMatchDetails(id);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <WebsiteHeader />
        <main className="pt-20">
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <Skeleton className="h-64 w-full bg-white/10 rounded-2xl" />
              <div className="flex justify-center gap-4">
                <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
                <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
                <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
              </div>
              <Skeleton className="h-96 w-full bg-white/10 rounded-2xl" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state (only show if no data available)
  if (error && !match) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <WebsiteHeader />
        <main className="pt-20">
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-white">
                  {t('match.error', 'Не удалось загрузить данные матча. Попробуйте позже.')}
                </AlertDescription>
              </Alert>
              <div className="mt-6 text-center">
                <Link to="/">
                  <Button variant="outline" className="border-white/20 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('match.backToMatches', 'Все матчи')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!match) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <WebsiteHeader />
        <main className="pt-20 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('match.notFound', 'Матч не найден')}</h1>
            <Link to="/">
              <Button variant="outline" className="border-white/20 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('match.backToMatches', 'Все матчи')}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check what data is available
  const hasLineup = !!match.lineup?.home_team?.lineup?.length;
  const hasStats = !!match.teamStats;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <WebsiteHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <MatchHero match={match} />

        {/* Tabs Navigation */}
        <MatchTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasLineup={hasLineup}
          hasStats={hasStats}
        />

        {/* Tab Content */}
        <section className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MatchOverview match={match} />
              </motion.div>
            )}

            {activeTab === 'lineups' && (
              <motion.div
                key="lineups"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {hasLineup && match.lineup ? (
                  <LineupPitch
                    homeTeam={match.lineup.home_team}
                    awayTeam={match.lineup.away_team}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">{t('match.noLineup', 'Составы пока не объявлены')}</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {hasStats && match.teamStats ? (
                  <MatchStats
                    homeStats={match.teamStats.home}
                    awayStats={match.teamStats.away}
                    homeColor={match.homeTeam.brandColor}
                    awayColor={match.awayTeam.brandColor}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">{t('match.noStats', 'Статистика недоступна')}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MatchPage;

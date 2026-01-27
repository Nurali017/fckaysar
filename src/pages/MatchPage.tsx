import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageWrapper } from '@/components/website/PageWrapper';
import { Skeleton } from '@/components/ui/skeleton';

import { MatchHero } from '@/components/website/match/MatchHero';
import { MatchTabs, type MatchTab } from '@/components/website/match/MatchTabs';
import { MatchOverview } from '@/components/website/match/MatchOverview';
import { MatchStats } from '@/components/website/match/MatchStats';

import { useMatchDetails } from '@/hooks/api/useMatchDetails';

const MatchPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MatchTab>('overview');

  const { data: match, isLoading, error } = useMatchDetails(id);

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <main className="pt-20 bg-[hsl(222,47%,11%)] min-h-screen">
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <Skeleton className="h-64 w-full bg-white/5 rounded-none" />
              <div className="flex justify-center gap-4">
                <Skeleton className="h-10 w-32 bg-white/5 rounded-none" />
                <Skeleton className="h-10 w-32 bg-white/5 rounded-none" />
                <Skeleton className="h-10 w-32 bg-white/5 rounded-none" />
              </div>
              <Skeleton className="h-96 w-full bg-white/5 rounded-none" />
            </div>
          </section>
        </main>
      </PageWrapper>
    );
  }

  // Error state
  if (error && !match) {
    return (
      <PageWrapper>
        <main className="pt-20 min-h-screen bg-[hsl(222,47%,11%)] flex items-center justify-center">
          <div className="text-center text-white/60">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="mb-6 font-mono text-lg">
              {t('match.error', 'Failed to load match data')}
            </p>
            <Link to="/matches">
              <span className="text-red-500 hover:text-white transition-colors uppercase font-mono text-sm tracking-wider border-b border-red-500 hover:border-white pb-1">
                {t('match.backToMatches', 'Back to Matches')}
              </span>
            </Link>
          </div>
        </main>
      </PageWrapper>
    );
  }

  // Not found state
  if (!match) {
    return (
      <PageWrapper>
        <main className="pt-20 min-h-screen bg-[hsl(222,47%,11%)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display uppercase text-white mb-4">
              {t('match.notFound', 'Match not found')}
            </h1>
            <Link to="/matches">
              <span className="text-red-500 hover:text-white transition-colors uppercase font-mono text-sm tracking-wider border-b border-red-500 hover:border-white pb-1">
                {t('match.backToMatches', 'Back to Matches')}
              </span>
            </Link>
          </div>
        </main>
      </PageWrapper>
    );
  }

  // Check what data is available
  const hasStats = !!match.teamStats;

  return (
    <PageWrapper>
      <main className="pt-24 md:pt-32 min-h-screen bg-[hsl(222,47%,11%)] pb-20">
        {/* Back Link */}
        <div className="container mx-auto px-4 mb-6">
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 text-red-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-wider"
          >
            <ChevronLeft className="w-3 h-3" /> {t('match.backToMatches', 'Back to Matches')}
          </Link>
        </div>

        {/* Hero Section */}
        <MatchHero match={match} />

        {/* Tabs Navigation */}
        <MatchTabs activeTab={activeTab} onTabChange={setActiveTab} hasStats={hasStats} />

        {/* Tab Content */}
        <section className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <MatchOverview match={match} />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                  <div className="text-center py-20 bg-white/5 border border-white/5">
                    <p className="text-white/40 font-mono text-sm uppercase">
                      {t('match.noStats', 'Stats not available')}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </PageWrapper>
  );
};

export default MatchPage;

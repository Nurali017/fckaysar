import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, BarChart3, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '@/components/website/PageWrapper';
import { SEO } from '@/components/SEO';
import { FadeInWhenVisible } from '@/components/animations/FadeInWhenVisible';
import { useTeamStatsWithForm } from '@/hooks/api/useTeamStats';
import { useIsMobile } from '@/hooks/useIsMobile';

// Stats components
import {
  StatsBentoGrid,
  MatchResultsCard,
  GoalsAnalysisCard,
  DetailedStatsGrid,
  FormWithLegend,
  SeasonProgressRing,
} from '@/components/stats';

const StatsPage = () => {
  const { data: stats, isLoading, error } = useTeamStatsWithForm();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <PageWrapper>
      <SEO
        title="Статистика"
        description="Статистика игроков и команды ФК Кайсар"
        path="/statistics"
      />
      <main className="min-h-screen bg-[hsl(222,47%,11%)] pt-20 pb-20">
        {/* Hero Section */}
        <section className="relative pt-12 pb-12 border-b border-white/10 mb-12">
          <div className="container mx-auto px-4 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-red-500 hover:text-white mb-6 transition-colors font-mono text-xs uppercase tracking-wider"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>{t('stats.backToHome', 'Back to Home')}</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <motion.div
                initial={isMobile ? { opacity: 1 } : { opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: isMobile ? 0 : 0.6 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display uppercase text-white leading-none">
                    {t('stats.title', 'Season Stats')} <span className="text-red-600">2025</span>
                  </h1>
                </div>
                <p className="font-mono text-white/50 text-sm uppercase tracking-wider pl-0 sm:pl-12">
                  {t('stats.subtitle', 'Comprehensive team performance analysis')}
                </p>
              </motion.div>

              {/* Season Progress Ring */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-white/5 border border-white/10 p-4">
                    <SeasonProgressRing
                      gamesPlayed={stats.raw.games_played}
                      totalGames={stats.raw.games_total}
                      size="lg"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 space-y-8 md:space-y-16">
          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Error State */}
          {error && (
            <div className="py-20 flex flex-col items-center text-center text-white/60 gap-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
              <p>{t('stats.errorLoading', 'Failed to load stats')}</p>
            </div>
          )}

          {/* Stats Content */}
          {stats && (
            <>
              {/* Bento Grid - Key Stats */}
              <FadeInWhenVisible>
                <section>
                  <SectionHeader
                    title={t('stats.sections.keyStats', 'Key Stats')}
                    subtitle={t('stats.sections.keyStatsSubtitle', 'Primary Indicators')}
                  />
                  <StatsBentoGrid stats={stats} />
                </section>
              </FadeInWhenVisible>

              {/* Performance Charts Section */}
              <FadeInWhenVisible delay={0.1}>
                <section>
                  <SectionHeader
                    title={t('stats.sections.performanceAnalysis', 'Performance Analysis')}
                    subtitle={t(
                      'stats.sections.performanceSubtitle',
                      'Win rate & Goal distribution'
                    )}
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6">
                      <MatchResultsCard
                        wins={stats.raw.win}
                        draws={stats.raw.draw}
                        losses={stats.raw.match_loss}
                        gamesPlayed={stats.raw.games_played}
                      />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6">
                      <GoalsAnalysisCard
                        goalsScored={stats.raw.goals}
                        goalsConceded={stats.raw.goals_conceded}
                        goalsPerGame={stats.goalsPerGame}
                        concededPerGame={stats.goalsConcededPerGame}
                      />
                    </div>
                  </div>
                </section>
              </FadeInWhenVisible>

              {/* Form Section */}
              {stats.form.length > 0 && (
                <FadeInWhenVisible delay={0.2}>
                  <section>
                    <SectionHeader
                      title={t('stats.sections.recentForm', 'Recent Form')}
                      subtitle={t('stats.sections.recentFormSubtitle', 'Last 5 Matches')}
                    />
                    <div className="bg-white/5 border border-white/10 p-8">
                      <FormWithLegend form={stats.form} />
                    </div>
                  </section>
                </FadeInWhenVisible>
              )}

              {/* Detailed Stats Grid */}
              <FadeInWhenVisible delay={0.3}>
                <section>
                  <SectionHeader
                    title={t('stats.sections.detailedStats', 'Detailed Stats')}
                    subtitle={t('stats.sections.detailedStatsSubtitle', 'In-depth breakdown')}
                  />
                  <DetailedStatsGrid stats={stats} />
                </section>
              </FadeInWhenVisible>

              {/* Last Updated */}
              {stats.raw.lastUpdated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center pt-12 border-t border-white/10"
                >
                  <p className="font-mono text-white/40 text-xs uppercase tracking-widest">
                    {t('stats.lastUpdated', 'Last Updated')}:{' '}
                    {new Date(stats.raw.lastUpdated).toLocaleDateString()}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </PageWrapper>
  );
};

// Section Header Component
const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8 border-l-4 border-red-600 pl-4">
    <h2 className="text-2xl md:text-3xl font-display text-white uppercase leading-none mb-1">
      {title}
    </h2>
    {subtitle && (
      <p className="font-mono text-white/40 text-xs uppercase tracking-wider">{subtitle}</p>
    )}
  </div>
);

// Loading State Component
const LoadingState = () => {
  return (
    <div className="space-y-12">
      <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto" />
    </div>
  );
};

export default StatsPage;

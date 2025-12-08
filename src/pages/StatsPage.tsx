/**
 * StatsPage - Team Statistics Page
 * Modern, premium sports portal design with Bento Grid layout
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, BarChart3, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FadeInWhenVisible } from '@/components/animations/FadeInWhenVisible';
import { useTeamStatsWithForm } from '@/hooks/api/useTeamStats';

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

  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-b from-red-900/20 via-red-900/5 to-black overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('stats.backToHome')}</span>
          </Link>

          {/* Title with season progress */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-2">
                <BarChart3 className="w-10 h-10 text-red-500" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter">
                  {t('stats.title').split(' ')[0]} <span className="text-red-500">{t('stats.title').split(' ').slice(1).join(' ')}</span>
                </h1>
              </div>
              <p className="text-gray-400 text-lg md:text-xl">
                {t('stats.subtitle')}
              </p>
            </motion.div>

            {/* Season Progress Ring */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <SeasonProgressRing
                  gamesPlayed={stats.raw.games_played}
                  totalGames={stats.raw.games_total}
                  size="lg"
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-white">
              {t('stats.errorLoading')}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Content */}
        {stats && (
          <>
            {/* Bento Grid - Key Stats */}
            <FadeInWhenVisible>
              <section>
                <SectionHeader
                  title={t('stats.sections.keyStats')}
                  subtitle={t('stats.sections.keyStatsSubtitle')}
                />
                <StatsBentoGrid stats={stats} />
              </section>
            </FadeInWhenVisible>

            {/* Performance Charts Section */}
            <FadeInWhenVisible delay={0.1}>
              <section>
                <SectionHeader
                  title={t('stats.sections.performanceAnalysis')}
                  subtitle={t('stats.sections.performanceSubtitle')}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MatchResultsCard
                    wins={stats.raw.win}
                    draws={stats.raw.draw}
                    losses={stats.raw.match_loss}
                    gamesPlayed={stats.raw.games_played}
                  />
                  <GoalsAnalysisCard
                    goalsScored={stats.raw.goals}
                    goalsConceded={stats.raw.goals_conceded}
                    goalsPerGame={stats.goalsPerGame}
                    concededPerGame={stats.goalsConcededPerGame}
                  />
                </div>
              </section>
            </FadeInWhenVisible>

            {/* Form Section (if available) */}
            {stats.form.length > 0 && (
              <FadeInWhenVisible delay={0.2}>
                <section>
                  <SectionHeader
                    title={t('stats.sections.recentForm')}
                    subtitle={t('stats.sections.recentFormSubtitle')}
                  />
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
                    <FormWithLegend form={stats.form} />
                  </div>
                </section>
              </FadeInWhenVisible>
            )}

            {/* Detailed Stats Grid */}
            <FadeInWhenVisible delay={0.3}>
              <section>
                <SectionHeader
                  title={t('stats.sections.detailedStats')}
                  subtitle={t('stats.sections.detailedStatsSubtitle')}
                />
                <DetailedStatsGrid stats={stats} />
              </section>
            </FadeInWhenVisible>

            {/* Last Updated */}
            {stats.raw.lastUpdated && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center text-gray-500 text-sm"
              >
                {t('stats.lastUpdated')}: {new Date(stats.raw.lastUpdated).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </motion.p>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <div className="mb-6">
    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-400 mt-1">{subtitle}</p>
    )}
  </div>
);

// Loading State Component
const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Bento Grid Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 bg-white/10 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-[320px] sm:col-span-2 sm:row-span-2 bg-white/10 rounded-3xl" />
          <Skeleton className="h-[150px] bg-white/10 rounded-2xl" />
          <Skeleton className="h-[150px] bg-white/10 rounded-2xl" />
          <Skeleton className="h-[150px] bg-white/10 rounded-2xl" />
          <Skeleton className="h-[150px] bg-white/10 rounded-2xl" />
        </div>
      </div>

      {/* Charts Skeleton */}
      <div>
        <Skeleton className="h-8 w-56 bg-white/10 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] bg-white/10 rounded-3xl" />
          <Skeleton className="h-[400px] bg-white/10 rounded-3xl" />
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>{t('stats.loadingStats')}</span>
      </div>
    </div>
  );
};

export default StatsPage;

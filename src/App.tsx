import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';

// Eager load - Home and NotFound are critical for first render
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Lazy load - These pages are loaded on-demand for better initial bundle size
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const MatchesPage = lazy(() => import('./pages/MatchesPage'));
const MatchPage = lazy(() => import('./pages/MatchPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const StandingsPage = lazy(() => import('./pages/StandingsPage'));
const MediaPage = lazy(() => import('./pages/MediaPage'));

// Новые страницы по образцу ФК Краснодар
const StadiumPage = lazy(() => import('./pages/StadiumPage'));
const CityPage = lazy(() => import('./pages/CityPage'));

// Раздел Клуб
const ClubPage = lazy(() => import('./pages/club/ClubPage'));
const LeadershipPage = lazy(() => import('./pages/club/LeadershipPage'));
const HistoryPage = lazy(() => import('./pages/club/HistoryPage'));
const PartnersPage = lazy(() => import('./pages/club/PartnersPage'));
const ContactsPage = lazy(() => import('./pages/club/ContactsPage'));
const InfrastructurePage = lazy(() => import('./pages/club/InfrastructurePage'));

// Раздел Академия (расширенный)
const AcademyTeamsPage = lazy(() => import('./pages/academy/AcademyTeamsPage'));
const AcademyCoachesPage = lazy(() => import('./pages/academy/AcademyCoachesPage'));
const AcademyBranchesPage = lazy(() => import('./pages/academy/AcademyBranchesPage'));
const RecommendPlayerPage = lazy(() => import('./pages/academy/RecommendPlayerPage'));

// Раздел Команда
const TeamStaffPage = lazy(() => import('./pages/team/TeamStaffPage'));

// Раздел Болельщику
const FansPage = lazy(() => import('./pages/fans/FansPage'));
const RulesPage = lazy(() => import('./pages/fans/RulesPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
  </div>
);

// Configure React Query with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />

                {/* Раздел Клуб */}
                <Route path="/club" element={<ClubPage />} />
                <Route path="/club/leadership" element={<LeadershipPage />} />
                <Route path="/club/history" element={<HistoryPage />} />
                <Route path="/club/partners" element={<PartnersPage />} />
                <Route path="/club/contacts" element={<ContactsPage />} />
                <Route path="/club/infrastructure" element={<InfrastructurePage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Раздел Команда */}
                <Route path="/team" element={<TeamPage />} />
                <Route path="/team/staff" element={<TeamStaffPage />} />
                <Route path="/statistics" element={<StatsPage />} />

                {/* Раздел Академия */}
                <Route path="/academy" element={<AcademyPage />} />
                <Route path="/academy/teams" element={<AcademyTeamsPage />} />
                <Route path="/academy/coaches" element={<AcademyCoachesPage />} />
                <Route path="/academy/branches" element={<AcademyBranchesPage />} />
                <Route path="/academy/recommend" element={<RecommendPlayerPage />} />

                {/* Стадион и Город */}
                <Route path="/stadium" element={<StadiumPage />} />
                <Route path="/city" element={<CityPage />} />

                {/* Матчи */}
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/match/:id" element={<MatchPage />} />
                <Route path="/standings" element={<StandingsPage />} />

                {/* Новости и Галерея */}
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/media" element={<MediaPage />} />

                {/* Раздел Болельщику */}
                <Route path="/fans" element={<FansPage />} />
                <Route path="/fans/rules" element={<RulesPage />} />

                {/* Магазин и Юридические страницы */}
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

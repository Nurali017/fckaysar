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
                <Route path="/about" element={<AboutPage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/match/:id" element={<MatchPage />} />
                <Route path="/statistics" element={<StatsPage />} />
                <Route path="/academy" element={<AcademyPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/team" element={<TeamPage />} />
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

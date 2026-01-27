import { SEO } from '@/components/SEO';
import { HeroSlider } from '@/components/website/HeroSlider';
import { MatchSlider } from '@/components/website/MatchSlider';
import { LeagueTable } from '@/components/website/LeagueTable';
import { NewsSection } from '@/components/website/NewsSection';

import { PartnersSection } from '@/components/website/PartnersSection';
import { FadeInWhenVisible } from '@/components/animations/FadeInWhenVisible';
import { PageWrapper } from '@/components/website/PageWrapper';

const Home = () => {
  return (
    <PageWrapper>
      <SEO path="/" />
      <main className="bg-black min-h-screen">
        {/* Hero Section - Full Screen News Slider */}
        <HeroSlider />

        {/* Match Center */}
        <FadeInWhenVisible>
          <MatchSlider />
        </FadeInWhenVisible>

        {/* League Table & Sidebar Section */}
        <FadeInWhenVisible>
          <LeagueTable />
        </FadeInWhenVisible>

        {/* Media Section (News Grid) */}
        <div id="news">
          <FadeInWhenVisible>
            <NewsSection />
          </FadeInWhenVisible>
        </div>

        {/* Partners Section */}
        <FadeInWhenVisible>
          <PartnersSection />
        </FadeInWhenVisible>
      </main>
    </PageWrapper>
  );
};

export default Home;

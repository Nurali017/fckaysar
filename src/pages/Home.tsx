import { HeroSlider } from '@/components/website/HeroSlider';
import { NewsSection } from '@/components/website/NewsSection';
import { MatchCenter } from '@/components/website/MatchCenter';
import { FanZone } from '@/components/website/FanZone';
import { LeagueTable } from '@/components/website/LeagueTable';
import { TeamSection } from '@/components/website/TeamSection';
import { GallerySection } from '@/components/website/GallerySection';
import { FadeInWhenVisible } from '@/components/animations/FadeInWhenVisible';
import { NewLeadershipSection } from '@/components/website/NewLeadershipSection';
import { PageWrapper } from '@/components/website/PageWrapper';

const Home = () => {
  return (
    <PageWrapper>
      <main>
        {/* Hero Section - Full Screen */}
        <HeroSlider />

        {/* New Leadership Section */}
        <FadeInWhenVisible>
          <NewLeadershipSection />
        </FadeInWhenVisible>

        {/* Match Center (Replaces MatchesSection) */}
        <div id="matches">
          <FadeInWhenVisible delay={0.2}>
            <MatchCenter />
          </FadeInWhenVisible>
        </div>

        {/* Fan Zone */}
        <FadeInWhenVisible>
          <FanZone />
        </FadeInWhenVisible>

        {/* League Table */}
        <FadeInWhenVisible>
          <LeagueTable />
        </FadeInWhenVisible>

        {/* News Section */}
        <div id="news">
          <FadeInWhenVisible>
            <NewsSection />
          </FadeInWhenVisible>
        </div>

        {/* Team Section */}
        <div id="team">
          <FadeInWhenVisible>
            <TeamSection />
          </FadeInWhenVisible>
        </div>

        {/* Gallery Section */}
        <FadeInWhenVisible>
          <GallerySection />
        </FadeInWhenVisible>
      </main>
    </PageWrapper>
  );
};

export default Home;

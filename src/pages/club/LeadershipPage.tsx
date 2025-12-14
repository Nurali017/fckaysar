import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { Footer } from '@/components/website/Footer';
import { NewLeadershipSection } from '@/components/website/NewLeadershipSection';

const LeadershipPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <WebsiteHeader />

      <div className="pt-20">
        <NewLeadershipSection />
      </div>

      <Footer />
    </div>
  );
};

export default LeadershipPage;

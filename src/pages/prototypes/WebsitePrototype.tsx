import { WebsiteHeader } from "@/components/website/WebsiteHeader";
import { HeroSlider } from "@/components/website/HeroSlider";
import { MatchCenterWidget } from "@/components/website/MatchCenterWidget";

const WebsitePrototype = () => {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
            <WebsiteHeader />
            <main>
                <HeroSlider />
                <MatchCenterWidget />
            </main>
        </div>
    );
};

export default WebsitePrototype;

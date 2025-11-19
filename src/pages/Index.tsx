import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import { BenefitsSection } from "@/components/BenefitsSection";
import { PrototypesSection } from "@/components/PrototypesSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Transform FC Kaisar Into a
            <span className="block bg-gradient-premium bg-clip-text text-transparent">
              Digital Powerhouse
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            A premium digital platform that elevates your club's image, deepens fan engagement, 
            and unlocks new revenue streams — all owned and controlled by you.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Prototypes Section */}
      <PrototypesSection />

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose Your Digital Evolution
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three packages designed to match your ambition and grow with your club
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <PricingCard
            title="Standard"
            price="1,000,000"
            description="Fast digital presence for modern clubs"
            features={[
              "Club website or mobile app",
              "Match schedule & results",
              "Squad list with player profiles",
              "League tables & statistics",
              "Match protocols",
              "Admin panel for content",
              "News publishing system",
              "Basic analytics & metrics"
            ]}
            purpose="Launch your digital presence quickly and give fans a modern way to follow FC Kaisar"
          />

          <PricingCard
            title="Digital Ecosystem"
            price="20,000,000"
            description="Complete professional platform"
            features={[
              "Everything in Standard, plus:",
              "Multi-season player analytics",
              "Advanced performance tracking",
              "Player growth & development data",
              "Full staff & coach profiles",
              "Rich media sections (video, interviews)",
              "Fan accounts & personalization",
              "Mobile app with push notifications",
              "Loyalty & subscription systems",
              "CRM & database integrations"
            ]}
            purpose="Build a world-class digital ecosystem that engages fans deeply and positions FC Kaisar as a modern, professional club"
            highlighted
          />

          <PricingCard
            title="Professional"
            price="35,000,000"
            description="Full control + independent ticketing"
            features={[
              "Everything in Digital Ecosystem, plus:",
              "Independent ticket sales platform",
              "No Ticketon — you own the system",
              "QR code ticket generation",
              "Gate validation & scanning",
              "Complete sales dashboards",
              "Revenue analytics by match/sector",
              "Sales via website, app & fan profiles",
              "Financial reporting & insights",
              "Full platform ownership"
            ]}
            purpose="Gain complete financial control and eliminate intermediary fees while creating new revenue streams for FC Kaisar"
            premium
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-card backdrop-blur-sm border border-border shadow-card">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Lead the Digital Future?
          </h2>
          <p className="text-xl text-muted-foreground">
            We're ready to present a working prototype and discuss implementation details 
            tailored specifically for FC Kaisar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-premium text-primary-foreground hover:opacity-90 transition-opacity text-lg px-8 py-6">
              Schedule a Presentation
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10">
              View Technical Details
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

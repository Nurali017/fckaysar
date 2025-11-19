import { Users, TrendingUp, Sparkles } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Deeper Fan Engagement",
      description: "Connect with your supporters like never before. Give them personalized experiences, exclusive content, and direct communication channels that turn casual followers into passionate advocates."
    },
    {
      icon: TrendingUp,
      title: "New Revenue Streams",
      description: "Stop paying intermediaries. Own your ticketing, subscriptions, and digital merchandise. Every fan interaction becomes an opportunity to grow revenue while maintaining full financial control."
    },
    {
      icon: Sparkles,
      title: "Modern Professional Image",
      description: "Stand out in Kazakhstan football. A world-class digital presence signals ambition, professionalism, and forward-thinking leadership — attracting better sponsors, players, and media attention."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20 bg-card/30 backdrop-blur-sm rounded-3xl">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Why FC Kaisar Needs This <span className="text-accent">Now</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className="space-y-4 p-6 rounded-xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

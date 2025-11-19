import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  purpose: string;
  highlighted?: boolean;
  premium?: boolean;
}

export const PricingCard = ({
  title,
  price,
  description,
  features,
  purpose,
  highlighted,
  premium
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105",
        highlighted && "border-primary shadow-glow bg-gradient-card",
        premium && "border-accent bg-gradient-to-br from-card/80 to-accent/10",
        !highlighted && !premium && "border-border bg-card/50"
      )}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-premium text-primary-foreground text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}
      {premium && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
          Maximum Value
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{price.toLocaleString()}</span>
          <span className="text-muted-foreground">KZT</span>
        </div>

        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {feature.includes("Everything in") ? (
                <div className="text-sm font-semibold text-accent pt-1">{feature}</div>
              ) : (
                <>
                  <Check className={cn(
                    "w-5 h-5 flex-shrink-0 mt-0.5",
                    highlighted ? "text-primary" : premium ? "text-accent" : "text-muted-foreground"
                  )} />
                  <span className="text-sm">{feature}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground italic">
            <span className="font-semibold text-foreground">Purpose:</span> {purpose}
          </p>
        </div>

        <Button 
          className={cn(
            "w-full",
            highlighted && "bg-primary hover:bg-primary/90",
            premium && "bg-accent text-accent-foreground hover:bg-accent/90"
          )}
          size="lg"
        >
          Choose {title}
        </Button>
      </div>
    </div>
  );
};

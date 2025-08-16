import { FeatureItem } from "@/constants/landing";
import { cn } from "@/lib/utils";

// Feature card component
const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
  const Icon = feature.icon;

  return (
    <div>
      <div
        className={cn(
          'relative rounded-2xl px-4 pt-4 pb-4 text-sm',
          'bg-card ring-border ring',
          feature.cornerStyle,
        )}
      >
        <div className="text-primary mb-3 text-[2rem]">
          <Icon />
        </div>
        <h2 className="text-foreground mb-2.5 text-lg">{feature.title}</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          {feature.description}
        </p>
        {/* Decorative elements */}
        <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--primary)/0.15)_0%,transparent_100%)] opacity-60"></span>
      </div>
    </div>
  );
};

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;
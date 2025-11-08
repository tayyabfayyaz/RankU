import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Youtube } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
}

interface ServiceCardProps {
  service: Service;
}

const getIconComponent = (id: string): LucideIcon | null => {
  switch (id) {
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    default:
      return null;
  }
};

const getGradientClass = (id: string): string => {
  switch (id) {
    case "instagram":
      return "from-pink-500 to-rose-500";
    case "facebook":
      return "from-blue-600 to-blue-400";
    case "website":
      return "from-purple-500 to-indigo-500";
    case "youtube":
      return "from-red-500 to-red-600";
    default:
      return "from-primary to-accent";
  }
};

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const IconComponent = getIconComponent(service.id);
  const gradientClass = getGradientClass(service.id);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in border-border/50 bg-card">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-linear-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <CardContent className="p-6 relative z-10">
        {/* Icon Container */}
        <div className={`w-16 h-16 mb-6 rounded-2xl bg-linear-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {IconComponent ? (
            <IconComponent className="h-8 w-8 animate-scale-in" />
          ) : (
            <span className="text-3xl">{service.icon}</span>
          )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* CTA Button */}
        <Button 
          variant="ghost" 
          className="group/btn p-0 h-auto font-semibold text-foreground hover:text-primary"
          asChild
        >
          <a href={service.href} className="flex items-center gap-2">
            <span>Learn More</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </CardContent>

      {/* Animated Border */}
      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${gradientClass} blur-xl -z-10`} />
    </Card>
  );
};
import { Card } from "../ui/card";
import { InformationCard } from "@/types/hero";

interface InfoCardProps {
  card: InformationCard;
}

export function InfoCard({ card }: InfoCardProps) {
  return (
    <Card className="w-full h-full p-6">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{card.icon}</div>
        <h3 className="text-xl font-bold">{card.title}</h3>
      </div>
      <p className="text-muted-foreground mt-4">{card.description}</p>
    </Card>
  );
}

import { Indicator } from "@/app/(protected)/properties/[id]/page";
import { Card, CardHeader, CardContent } from "./ui/card";

interface IndicatorCardProps {
  indicator: Indicator;
}

export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const { title, value, topRight } = indicator;
  const Icon = indicator.icon;

  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex-row items-center justify-between space-y-0 p-6 pb-2">
        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="size-5" />
        </div>
        {topRight && <div className="text-right">{topRight}</div>}
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

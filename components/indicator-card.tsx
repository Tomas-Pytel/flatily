import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

interface IndicatorCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  topRight?: React.ReactNode;
  //progressBar?: boolean;
}

export default function IndicatorCard({
  icon,
  title,
  value,
  topRight,
}: IndicatorCardProps) {
  const Icon = icon;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-row items-start justify-between gap-1 pb-3">
        <div className=" size-10 rounded-md border-2 bg-muted flex items-center justify-center">
          <Icon className="size-6 text-muted-foreground" />
        </div>
        {topRight && <div className="ml-auto text-right">{topRight}</div>}
      </CardHeader>
      <CardContent>
        <CardDescription>{title}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardContent>
    </Card>
  );
}

import { Wrench } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import MaintenanceItem, { MaintenanceWithProperty } from "./maintenance-item";

interface MaintenanceCardProps {
  openMaintenances: MaintenanceWithProperty[];
}

export default function MaintenanceCard({
  openMaintenances,
}: MaintenanceCardProps) {
  return (
    <Card className="h-full">
      {openMaintenances.length > 0 ? (
        <CardContent className="p-0">
          <ul className="divide-y border-b-0">
            {openMaintenances.map((task) => (
              <MaintenanceItem key={task.id} task={task} />
            ))}
          </ul>
        </CardContent>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-50">
          <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
            <Wrench className="size-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg">Žiadne aktívne problémy</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Všetky vaše nehnuteľnosti sú momentálne v bezchybnom stave.
          </p>
        </div>
      )}
    </Card>
  );
}

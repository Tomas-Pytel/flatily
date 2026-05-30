"use client";

import { Maintenance, Property } from "@/lib/generated/prisma/client";
import { AlertCircle, Wrench } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { resolveMaintenance } from "@/app/actions/property-actions";
import { toast } from "sonner";

type MaintenanceWithProperty = Maintenance & {
  property: Pick<Property, "title" | "street">;
};

interface MaintenanceCardProps {
  openMaintenances: MaintenanceWithProperty[];
}

export default function MaintenanceCard({
  openMaintenances,
}: MaintenanceCardProps) {
  const handleResolve = async (taskId: string) => {
    const result = await resolveMaintenance(taskId);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Oprava bola úspešne vyriešená");
  };

  return (
    <Card className="h-full">
      {openMaintenances.length > 0 ? (
        <CardContent className="p-0">
          <ul className="divide-y border-b-0">
            {openMaintenances.map((task) => (
              <li
                key={task.id}
                className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="p-2 rounded-full bg-red-500/10 text-red-500 mt-0.5 group-hover:bg-red-500/20 transition-colors">
                  <AlertCircle className="size-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.property.street}, {task.property.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider pt-1">
                    Nahlásené: {task.createdAt.toLocaleDateString("sk-SK")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleResolve(task.id);
                  }}
                >
                  Vyriešiť
                </Button>
              </li>
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

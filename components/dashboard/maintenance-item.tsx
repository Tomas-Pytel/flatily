"use client";

import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useTransition } from "react";
import { resolveMaintenance } from "@/app/actions/property-actions";
import { toast } from "sonner";
import { Prisma } from "@/lib/generated/prisma/client";

export type MaintenanceWithProperty = Prisma.MaintenanceGetPayload<{
  include: {
    property: { select: { title: true; street: true } };
  };
}>;

export default function MaintenanceItem({
  task,
}: {
  task: MaintenanceWithProperty;
}) {
  const [isPending, startTransition] = useTransition();

  const handleResolve = () => {
    startTransition(async () => {
      const result = await resolveMaintenance(task.id);

      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Oprava bola úspešne vyriešená");
    });
  };

  return (
    <li
      key={task.id}
      className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors group"
    >
      <div className="p-2 rounded-full bg-red-500/10 text-red-500 mt-0.5 group-hover:bg-red-500/20 transition-colors">
        <AlertCircle className="size-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{task.title}</p>
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
        disabled={isPending}
        onClick={(e) => {
          e.preventDefault();
          handleResolve();
        }}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            {/* Spinner */}
            <CheckCircle2 className="size-4 animate-pulse text-muted-foreground" />
          </span>
        ) : (
          "Vyriešiť"
        )}
      </Button>
    </li>
  );
}

import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { PropertyDetailProps } from "./property-detail-cards";

export default function PropertyTenantPanel({ property }: PropertyDetailProps) {
  const isOccupied = property.status === "Obsadený";

  return (
    <Card className="max-w-2xl bg-neutral-50/50 p-5 shadow-none dark:bg-neutral-900/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {isOccupied ? "Nájomník je priradený" : "Nehnuteľnosť je voľná"}
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {isOccupied
              ? "Aktívna nájomná zmluva je evidovaná, podrobnosti o nájomníkovi sa však v tomto zobrazení nenačítavajú."
              : "Podľa aktuálne evidovaných zmlúv nie je nehnuteľnosť obsadená."}
          </p>
        </div>
        <Badge variant={isOccupied ? "success" : "warning"}>
          {property.status}
        </Badge>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <Info aria-hidden="true" className="size-4 shrink-0" />
        <span>
          Kontaktné údaje nájomníka a podrobnosti zmluvy nie sú súčasťou
          aktuálne načítaných údajov.
        </span>
      </div>
    </Card>
  );
}

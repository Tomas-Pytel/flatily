import type { PropertyListItem } from "@/types/property";
import {
  PropertiesToolbar,
  type SortByType,
  type StatusFilterType,
  type ViewModeType,
} from "@/components/properties/properties-toolbar";
import { PropertiesGrid } from "@/components/properties/properties-grid";
import { PropertiesTable } from "@/components/properties/properties-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PropertiesViewProps = {
  properties: PropertyListItem[];
  statusFilter: StatusFilterType;
  sortBy: SortByType;
  viewMode: ViewModeType;
};

export function ApartmentsView({
  properties,
  statusFilter,
  sortBy,
  viewMode,
}: PropertiesViewProps) {
  const filteredProperties = properties
    .filter((property) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "obsadeny" || statusFilter === "volny") {
        return property.status === statusFilter;
      }
      if (statusFilter === "problem_platba") {
        return property.paymentStatus === "Omeškané";
      }
      return property.openRepairsCount > 0;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rent_desc") return b.rentAmount - a.rentAmount;
      if (sortBy === "rent_asc") return a.rentAmount - b.rentAmount;
      return a.status.localeCompare(b.status);
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PropertiesToolbar
        statusFilter={statusFilter}
        sortBy={sortBy}
        viewMode={viewMode}
        apartments={properties}
        openRepairsCount={properties.reduce(
          (total, property) => total + property.openRepairsCount,
          0,
        )}
      />

      {properties.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          <p>Zatiaľ nemáte žiadny byt.</p>
          <Button asChild>
            <Link href="/properties/new">Pridať nový byt</Link>
          </Button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          <p>Žiadny byt nezodpovedá zvolenému filtru.</p>
        </div>
      ) : viewMode === "grid" ? (
        <PropertiesGrid properties={filteredProperties} />
      ) : (
        <PropertiesTable properties={filteredProperties} />
      )}
    </div>
  );
}

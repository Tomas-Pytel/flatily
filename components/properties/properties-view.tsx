import type { PropertyListItem } from "@/types/property";
import {
  PropertiesToolbar,
  type SortByType,
  type StatusFilterType,
  type ViewModeType,
} from "@/components/properties/properties-toolbar";
import { PropertiesGrid } from "@/components/properties/properties-grid";
import { PropertiesTable } from "@/components/properties/properties-table";

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

      {filteredProperties.length === 0 ? (
        <span>Zatiaľ nemáte žiadny byt</span>
      ) : viewMode === "grid" ? (
        <PropertiesGrid properties={filteredProperties} />
      ) : (
        <PropertiesTable properties={filteredProperties} />
      )}
    </div>
  );
}

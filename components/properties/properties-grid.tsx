import { ExtendedPropertyCard } from "@/components/properties/extended-property-card";
import type { PropertyListItem } from "@/types/property";

export function PropertiesGrid({
  properties,
}: {
  properties: PropertyListItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <ExtendedPropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

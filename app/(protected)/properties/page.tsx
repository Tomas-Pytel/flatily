import { PropertyCardInfo } from "@/components/properties/property-card-info";
import Link from "next/link";
import { mockProperties } from "@/lib/mock-data";
import { DashboardHeader } from "@/components/dashboard-header";

export default function PropertiesPage() {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Moje nehnuteľnosti" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockProperties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group outline-none"
            >
              <PropertyCardInfo property={property} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

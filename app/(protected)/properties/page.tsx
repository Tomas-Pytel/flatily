import { PropertyCardInfo } from "@/components/properties/property-card-info";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { Property } from "@/lib/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import DeletePropertyButton from "@/components/properties/delete-property-button";

export default async function PropertiesPage() {
  const user = await requireUser();

  const properties: Property[] = await prisma.property.findMany({
    where: {
      ownerId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex h-full flex-col">
      {/**Header */}
      <DashboardHeader title="Moje nehnuteľnosti">
        <Button size="sm" className="gap-2" asChild>
          <Link href={`/properties/new`}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Pridať nehnuteľnosť</span>
          </Link>
        </Button>
      </DashboardHeader>

      {/**Properties list */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* 2. Responsive Grid */}
        {properties.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <li key={property.id} className="relative group h-full">
                {/** Delete button */}
                <div className="absolute right-3 top-3 z-10">
                  <DeletePropertyButton propertyId={property.id} />
                </div>

                <Link
                  href={`/properties/${property.id}`}
                  className="block h-full"
                >
                  <PropertyCardInfo property={property} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          /* 3. Empty State */
          <div className="flex flex-col items-center justify-center h-[40vh] border-2 border-dashed rounded-2xl bg-background p-10 text-center">
            <Building2 className="size-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">
              Zatiaľ nemáte žiadne nehnuteľnosti
            </h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              Začnite pridaním svojej prvej nehnuteľnosti do systému.
            </p>
            <Button variant="outline" className="mt-6">
              Pridať prvú
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

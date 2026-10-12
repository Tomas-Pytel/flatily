import { PropertyCardInfo } from "@/components/properties/property-card-info";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Bell, Building2, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { Property } from "@/lib/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import DeletePropertyButton from "@/components/properties/delete-property-button";
import { PropertiesToolbar } from "@/components/properties/properties-toolbar";
import { ApartmentsView } from "@/components/properties/properties-view";

export default async function PropertiesPage() {
  const user = await requireUser();

  // const properties: Property[] = await prisma.property.findMany({
  //   where: {
  //     ownerId: user.id,
  //   },
  //   orderBy: { createdAt: "desc" },
  // });

  return (
    <div className="flex h-full flex-col">
      {/**Header */}
      <AppHeader
        title="Moje nehnuteľnosti"
        subtitle="Spravujte svoje byty, nájomníkov a nájomné zmluvy."
        primaryAction={{
          label: "Pridať nehnuteľnosť",
          href: "/properties/new",
        }}
      >
        <Bell className="size-4 text-muted-foreground/70" />
      </AppHeader>

      {/**Properties list */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* 2. Responsive Grid */}
        <ApartmentsView />
      </main>
    </div>
  );
}

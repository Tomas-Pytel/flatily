import PropertyHeroSection from "@/components/properties/property-hero-section";
import IndicatorCard from "@/components/indicator-card";
import { Button } from "@/components/ui/button";
import TenantInfoCard, {
  TenantInfo,
} from "@/components/properties/tenant-info-card";
import RepairHistoryTable, {
  RepairLog,
} from "@/components/properties/repair-history-table";
import DocumentsCard, {
  DocumentInfo,
} from "@/components/properties/documents-card";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Banknote, TrendingUp, Users } from "lucide-react";
import NewMaintenanceForm from "@/components/properties/new-maintenance-form";
import { PropertyGalleryModal } from "@/components/properties/property-gallery-modal";

export interface Indicator {
  icon: React.ElementType;
  title: string;
  value: string | number;
  topRight?: React.ReactNode;
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: {
      ownerId: user.id,
      id: id,
    },
    include: {
      images: {
        orderBy: { createdAt: "desc" },
      },
      leases: {
        where: { isActive: true },
        include: { tenant: true },
      },
      maintenance: {
        orderBy: { createdAt: "desc" },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const isOccupied = property.leases.length > 0;

  const indicators: Indicator[] = [
    {
      icon: Banknote,
      title: "MESAČNÝ NÁJOM",
      value: `${property.monthlyRent} €`,
    },
    {
      icon: TrendingUp,
      title: "ROČNÝ VÝNOS",
      value: "5.82%",
    },
    {
      icon: Users,
      title: "OBSADENOSŤ",
      value: isOccupied ? "100%" : "0%",
      topRight: isOccupied ? (
        <span className="text-xs text-green-500 font-medium">Obsadené</span>
      ) : (
        <span className="text-xs text-red-500 font-medium">Voľné</span>
      ),
    },
  ];

  const tenants: TenantInfo[] = property.leases.map((lease) => ({
    id: lease.tenant.id,
    name: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
    leaseEndDate: lease.endDate.toLocaleDateString("sk-SK"),
    paymentStatus: "Uhradené", // Zatiaľ natvrdo, neskôr napojíme na Transactions
    deposit: lease.depositAmount,
    phone: lease.tenant.phone || "Nezadané",
    email: lease.tenant.email,
    image: lease.tenant.imageUrl || undefined,
  }));

  const repairs: RepairLog[] = property.maintenance.map((m) => ({
    id: m.id,
    date: m.createdAt.toLocaleDateString("sk-SK"),
    workType: m.title,
    provider: m.provider || "Neznámy",
    cost: m.cost || 0,
  }));

  const documents: DocumentInfo[] = property.documents.map((d) => ({
    id: d.id,
    title: d.title,
    date: d.createdAt.toLocaleDateString("sk-SK"),
    size:
      d.fileSize > 1048576
        ? `${(d.fileSize / 1048576).toFixed(1)} MB`
        : `${Math.round(d.fileSize / 1024)} KB`,
    fileUrl: d.fileUrl,
  }));

  return (
    <div className="flex h-full flex-col">
      {/**Header */}
      <DashboardHeader title="Detail nehnuteľnosti" />

      {/**Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8">
        <PropertyHeroSection property={property} />

        {/**Gallery Modal */}
        <div className="flex justify-end -mt-2 mb-2">
          <PropertyGalleryModal
            propertyId={property.id}
            images={property.images}
            currentPrimaryUrl={property.imageUrl}
            userId={user.id}
          />
        </div>

        {/**Indicators */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {indicators.map((indicator, index) => (
            <IndicatorCard key={index} indicator={indicator} />
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/**Left Column: Tenants & Repairs */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold tracking-tight">
                  Aktuálni nájomcovia
                </h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/properties/${id}/tenants/new`}>
                    Pridať nájomcu
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tenants.map((tenant, index) => (
                  <TenantInfoCard key={index} tenant={tenant} />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold tracking-tight">
                  História opráv
                </h3>
                <NewMaintenanceForm propertyId={id} />
                {/* <Button variant="outline" size="sm">
                  Pridať opravu
                </Button> */}
              </div>
              <RepairHistoryTable repairs={repairs} />
            </section>
          </div>

          {/* Right Column: Documents */}
          <section className="flex flex-col h-full">
            <DocumentsCard
              documents={documents}
              propertyId={id}
              userId={user.id}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

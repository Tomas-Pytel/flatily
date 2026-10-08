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
import RentChargesCard, {
  ChargeRow,
} from "@/components/properties/rent-charges-card";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Banknote, TrendingUp, Users } from "lucide-react";
import MaintenanceFormDialog from "@/components/properties/new-maintenance-form";
import { PropertyGalleryModal } from "@/components/properties/property-gallery-modal";
import { chargeView, leasePaymentStatus } from "@/lib/rent-charges";

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
        where: { status: "ACTIVE" },
        include: {
          tenant: true,
          charges: {
            orderBy: { period: "asc" },
            include: { payments: { select: { amount: true } } },
          },
        },
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
      value: `${Number(property.monthlyRent).toLocaleString("sk-SK")} €`,
    },
    {
      icon: TrendingUp,
      title: "ROČNÝ VÝNOS",
      value: "5.82%", // TODO: needs Property.purchasePrice
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
    leaseId: lease.id,
    name: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
    leaseEndDate: lease.endDate.toLocaleDateString("sk-SK"),
    paymentStatus: leasePaymentStatus(lease.charges),
    deposit: Number(lease.depositAmount),
    phone: lease.tenant.phone || "Nezadané",
    email: lease.tenant.email,
    image: lease.tenant.imageUrl || undefined,
  }));

  // at most one active lease per property (DB partial unique index)
  const charges: ChargeRow[] = (property.leases[0]?.charges ?? []).map((c) => ({
    id: c.id,
    period: c.period,
    dueDate: c.dueDate,
    amount: Number(c.amount),
    paid: c.payments.reduce((sum, p) => sum + Number(p.amount), 0),
    view: chargeView(c),
  }));

  const repairs: RepairLog[] = property.maintenance.map((m) => ({
    maintenanceId: m.id,
    resolvedDate: m.resolvedDate ?? m.createdAt,
    title: m.title,
    provider: m.provider || "Neznámy",
    cost: m.cost ? Number(m.cost) : 0,
    description: m.description ?? undefined,
    status: m.status,
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
      <AppHeader title="Detail nehnuteľnosti" />

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
                {!isOccupied && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/properties/${id}/tenants/new`}>
                      Pridať nájomcu
                    </Link>
                  </Button>
                )}
              </div>
              {tenants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nehnuteľnosť je voľná.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {tenants.map((tenant) => (
                    <TenantInfoCard key={tenant.leaseId} tenant={tenant} />
                  ))}
                </div>
              )}
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold tracking-tight">
                  História opráv
                </h3>
                <MaintenanceFormDialog
                  propertyId={id}
                  triggerButton={
                    <Button variant="outline" className="cursor-pointer">
                      Pridať opravu
                    </Button>
                  }
                />
              </div>
              <RepairHistoryTable repairs={repairs} propertyId={id} />
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

        {/**Rent charges */}
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold tracking-tight">Platby nájmu</h3>
          <RentChargesCard charges={charges} />
        </section>
      </main>
    </div>
  );
}

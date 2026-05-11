import {
  documents,
  indicators,
  mockProperties,
  repairs,
  tenants,
} from "@/lib/mock-data";
import PropertyHeroSection from "@/components/properties/property-hero-section";
import IndicatorCard from "@/components/indicator-card";
import { Button } from "@/components/ui/button";
import TenantInfoCard from "@/components/properties/tenant-info-card";
import RepairHistoryTable from "@/components/properties/repair-history-table";
import DocumentsCard from "@/components/properties/documents-card";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";

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
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === Number(id));

  if (!property) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      {/**Header */}
      <DashboardHeader title="Detail nehnuteľnosti" />

      {/**Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8">
        <PropertyHeroSection property={property} />

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
                <Button variant="outline" size="sm">
                  História nájmov
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tenants.map((tenant, index) => (
                  <TenantInfoCard key={index} {...tenant} />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold tracking-tight">
                  História opráv
                </h3>
                <Button variant="outline" size="sm">
                  Pridať opravu
                </Button>
              </div>
              <RepairHistoryTable repairs={repairs} />
            </section>
          </div>

          {/* Right Column: Documents */}
          <section className="flex flex-col h-full">
            <DocumentsCard documents={documents} />
          </section>
        </div>
      </main>
    </div>
  );
}

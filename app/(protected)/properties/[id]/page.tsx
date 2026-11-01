import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/common/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import PropertyHeader from "@/components/properties/property-detail/property-header";
import PropertyDetailContent from "@/components/properties/property-detail/property-detail-content";
import { getProperty } from "@/app/actions/properties";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const response = await getProperty(id);

  if (!response.success) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Detail nehnuteľnosti"
        subtitle="Prehľad a správa nehnuteľnosti."
      />

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:p-8 *:shrink-0">
        {/* Navigate back to properties list */}
        <div>
          <Button
            asChild
            variant="ghost"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Link href="/properties">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Späť na zoznam bytov</span>
            </Link>
          </Button>
        </div>

        {/* Property detail */}
        <Card className="overflow-hidden rounded-xl bg-white shadow-xs dark:bg-[#141414]">
          <PropertyHeader property={response.data} />
          <PropertyDetailContent property={response.data} />
        </Card>
      </main>
    </div>
  );
}

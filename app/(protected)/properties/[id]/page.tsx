import Link from "next/link";
import { AppHeader } from "@/components/common/app-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PropertyHeader from "@/components/properties/property-detail/property-header";
import { getProperty } from "@/app/actions/properties";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const response = await getProperty(id);

  if (!response.success)
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Nehnuteľnosť sa nenašla</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Požadovaný byt neexistuje alebo k nemu nemáte prístup.
          </p>
          <Button asChild className="mt-6">
            <Link href="/properties">Späť na nehnuteľnosti</Link>
          </Button>
        </div>
      </main>
    );

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        title="Detail nehnuteľnosti"
        subtitle="Táto stránka bude čoskoro dostupná."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Navigate back to properties list */}
        <div>
          <Button
            asChild
            variant="outline"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Link href="/properties">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Späť na zoznam bytov</span>
            </Link>
          </Button>
        </div>

        {/* Property detail */}
        <div className="bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
          <PropertyHeader property={response.data} />
        </div>
      </main>
    </div>
  );
}

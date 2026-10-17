import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/auth";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  await requireUser();
  const { id } = await params;

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        title="Detail nehnuteľnosti"
        subtitle="Táto stránka bude čoskoro dostupná."
      />

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Detail bytu</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Detail nehnuteľnosti {id} je pripravený na doplnenie.
          </p>
          <Link
            href="/properties"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Späť na nehnuteľnosti
          </Link>
        </div>
      </main>
    </div>
  );
}

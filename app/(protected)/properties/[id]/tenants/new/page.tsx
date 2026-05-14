import { DashboardHeader } from "@/components/dashboard-header";
import NewTenantForm from "@/components/properties/new-tenant-form";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default async function NewTenantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  <div className="flex h-full flex-col bg-muted/20">
    <DashboardHeader title="Pridanie nového nájomcu">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/properties/${id}`}>Zrušiť</Link>
      </Button>
    </DashboardHeader>

    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
      <NewTenantForm propertyId={id} />
    </main>
  </div>;
}

import { getTenantDetail, updateTenant } from "@/app/actions/tenants";
import { AppHeader } from "@/components/common/app-header";
import { TenantForm } from "@/components/tenants/tenant-form";
import { Bell } from "lucide-react";
import { notFound } from "next/navigation";

interface UpdateTenantPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateTenantPage({
  params,
}: UpdateTenantPageProps) {
  const { id } = await params;
  const response = await getTenantDetail(id);

  if (!response.success) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Upraviť nájomníka"
        subtitle="Upravte kontaktné a osobné údaje nájomníka."
      >
        <Bell className="size-4 text-muted-foreground" />
      </AppHeader>
      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:gap-8 lg:p-8">
        <TenantForm
          tenant={response.data}
          cancelHref="/tenants"
          action={updateTenant.bind(null, id)}
        />
      </main>
    </div>
  );
}

import { createNewTenant } from "@/app/actions/tenants";
import { AppHeader } from "@/components/common/app-header";
import { TenantForm } from "@/components/tenants/tenant-form";
import { Bell, UserPlus } from "lucide-react";

export default async function NewTenantPage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Nájomníci"
        subtitle="Prehľad nájomníkov, kontaktných údajov a zmluvných vzťahov."
      >
        <Bell className="size-4 text-muted-foreground" />
      </AppHeader>
      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:gap-8 lg:p-8">
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-[#004AAD] dark:text-[#3B82F6]" />
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Nový nájomník
          </h3>
        </div>
        <TenantForm action={createNewTenant} />
      </main>
    </div>
  );
}

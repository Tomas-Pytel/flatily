import { AppHeader } from "@/components/common/app-header";
import { Bell } from "lucide-react";

export default async function TenantsPage() {
  return (
    <div className="flex h-full flex-col">
      {/*Header */}
      <AppHeader
        title="Nájomníci"
        subtitle="Prehľad nájomníkov, kontaktných údajov a zmluvných vzťahov."
        primaryAction={{
          label: "Pridať nájomníka",
          href: "/tenants/new",
        }}
      >
        <Bell className="size-4 text-muted-foreground/70" />
      </AppHeader>

      {/*Properties list */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8"></main>
    </div>
  );
}

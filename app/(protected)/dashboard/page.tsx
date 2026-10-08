import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/auth";
import { Bell } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        title="Prehľad"
        subtitle="Tu máte prehľad o svojich bytoch a nájmoch."
        primaryAction={{
          label: "Pridať nehnuteľnosť",
          href: "/properties/new",
        }}
      >
        <Bell className="size-4 text-muted-foreground/70" />
      </AppHeader>

      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8 bg-amber-700"></main>
    </div>
  );
}

import { AppHeader } from "@/components/app-header";
import IndicatorCard from "@/components/indicator-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import MaintenanceCard from "@/components/dashboard/maintenance-card";
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
      {false && (
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6 lg:gap-8">
          {/* Indicators */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {indicators.map((stat, index) => (
              <IndicatorCard key={index} indicator={stat} />
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Information about activity */}
            <section className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Očakávajú pozornosť
              </h2>
              <MaintenanceCard openMaintenances={openMaintenances} />
            </section>

            {/* Quick actions */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Rýchle akcie
              </h2>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                    Správa portfólia
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-12"
                    asChild
                  >
                    <Link href="/properties/new">
                      <Building2 className="size-4 text-primary/70" /> Pridať
                      nehnuteľnosť
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-12"
                    asChild
                  >
                    <Link href="/properties">
                      <Users className="size-4 text-primary/70" /> Spravovať
                      nájomcov
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-12"
                  >
                    <Wrench className="size-4 text-primary/70" /> Nahlásiť novú
                    opravu
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}

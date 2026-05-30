import { DashboardHeader } from "@/components/dashboard-header";
import IndicatorCard from "@/components/indicator-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Banknote, ArrowUpRight, Building2, Users, Wrench } from "lucide-react";
import Link from "next/link";
import { Indicator } from "../properties/[id]/page";
import MaintenanceCard from "@/components/dashboard/maintenance-card";

export default async function DashboardPage() {
  const user = await requireUser();

  const [propertiesCount, activeLeases, openMaintenances] = await Promise.all([
    prisma.property.count({
      where: { ownerId: user.id },
    }),

    prisma.lease.findMany({
      where: {
        isActive: true,
        property: { ownerId: user.id },
      },
      select: { rentAmount: true },
    }),

    prisma.maintenance.findMany({
      where: {
        status: { not: "RESOLVED" },
        property: { ownerId: user.id },
      },
      include: {
        property: { select: { title: true, street: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
  ]);

  const totalMonthlyIncome = activeLeases.reduce(
    (sum, lease) => sum + lease.rentAmount,
    0,
  );
  const occupancyRate =
    propertiesCount > 0
      ? Math.round((activeLeases.length / propertiesCount) * 100)
      : 0;
  const maintenanceCount = openMaintenances.length;

  const indicators: Indicator[] = [
    {
      icon: Banknote,
      title: "MESAČNÝ PRÍJEM",
      value: `${totalMonthlyIncome.toLocaleString("sk-SK")} €`,
      topRight:
        totalMonthlyIncome > 0 ? (
          <span className="flex items-center text-xs font-medium text-green-500">
            <ArrowUpRight className="mr-1 size-3" /> Stabilné
          </span>
        ) : null,
    },
    {
      icon: Building2,
      title: "NEHNUTEĽNOSTI",
      value: propertiesCount,
    },
    {
      icon: Users,
      title: "OBSADENOSŤ",
      value: `${occupancyRate}%`,
      topRight:
        occupancyRate === 100 ? (
          <span className="text-xs font-medium text-green-500">
            Plne obsadené
          </span>
        ) : occupancyRate > 0 ? (
          <span className="text-xs font-medium text-amber-500">
            Máte voľné kapacity
          </span>
        ) : null,
    },
    {
      icon: Wrench,
      title: "AKTÍVNE OPRAVY",
      value: maintenanceCount,
      topRight:
        maintenanceCount > 0 ? (
          <span className="text-xs font-medium text-red-500">
            Vyžaduje pozornosť
          </span>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            Všetko v poriadku
          </span>
        ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Prehľad" />

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
                <Button variant="outline" className="justify-start gap-3 h-12">
                  <Wrench className="size-4 text-primary/70" /> Nahlásiť novú
                  opravu
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

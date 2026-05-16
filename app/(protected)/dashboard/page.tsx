import { DashboardHeader } from "@/components/dashboard-header";
import IndicatorCard from "@/components/indicator-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  Banknote,
  ArrowUpRight,
  Building2,
  Users,
  Wrench,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Indicator } from "../properties/[id]/page";

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
            <Card className="h-full">
              {openMaintenances.length > 0 ? (
                <CardContent className="p-0">
                  <ul className="divide-y border-b-0">
                    {openMaintenances.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="p-2 rounded-full bg-red-500/10 text-red-500 mt-0.5 group-hover:bg-red-500/20 transition-colors">
                          <AlertCircle className="size-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {task.property.street}, {task.property.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider pt-1">
                            Nahlásené:{" "}
                            {task.createdAt.toLocaleDateString("sk-SK")}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Vyriešiť
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-50">
                  <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                    <Wrench className="size-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    Žiadne aktívne problémy
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Všetky vaše nehnuteľnosti sú momentálne v bezchybnom stave.
                  </p>
                </div>
              )}
            </Card>
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

function ActivityItem({ title, desc, time, icon: Icon, iconColor }: any) {
  return (
    <li className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
      <div className={`p-2 rounded-full bg-muted mt-0.5 ${iconColor}`}>
        <Icon className="size-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <p className="text-[10px] text-muted-foreground uppercase font-bold">
          {time}
        </p>
      </div>
    </li>
  );
}

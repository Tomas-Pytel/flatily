import {
  AlertCircle,
  Building,
  CheckCircle2,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { KpiCard, type KpiCardProps } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import Skeleton from "@/components/common/loading-skeleton";
import { getDashboardSummary } from "@/lib/dashboard";
import { pluralize } from "@/lib/utils";

type DashboardDates = {
  now: Date;
  today: Date;
  currentMonth: Date;
  nextMonth: Date;
  twelveMonthsAgo: Date;
};

type DashboardKpisProps = DashboardDates & { userId: string };

const formatAmount = (amount: number) =>
  `${Math.round(amount).toLocaleString("sk-SK")} €`;

export async function DashboardKpis({
  userId,
  today,
  currentMonth,
  nextMonth,
  twelveMonthsAgo,
}: DashboardKpisProps) {
  const aggregates = await getDashboardSummary({
    userId,
    today,
    currentMonth,
    nextMonth,
    twelveMonthsAgo,
  });

  const cards: KpiCardProps[] = [
    {
      title: "Očakávaný príjem",
      value: formatAmount(aggregates.expectedRent),
      subtitle: "nájomné z platných zmlúv bez energií",
      statusColor: "success",
      icon: TrendingUp,
    },
    {
      title: "Obsadenosť",
      value: `${aggregates.occupiedPropertyCount}/${aggregates.propertyCount}`,
      subtitle: `${aggregates.propertyCount ? Math.round((aggregates.occupiedPropertyCount / aggregates.propertyCount) * 100) : 0}% bytov obsadených`,
      icon: Building,
      href: "/properties",
    },
    {
      title: "Uhradené tento mesiac",
      value: formatAmount(aggregates.paidThisMonth),
      subtitle: `${aggregates.currentRent ? Math.round((aggregates.paidThisMonth / aggregates.currentRent) * 100) : 0}% nájomného uhradené`,
      icon: CheckCircle2,
    },
    {
      title: "Po splatnosti",
      value: formatAmount(aggregates.overdueAmount),
      subtitle: `${aggregates.overdueCount} ${pluralize(aggregates.overdueCount, "neuhradená platba", "neuhradené platby", "neuhradených platieb")}`,
      icon: AlertCircle,
      statusColor: aggregates.overdueCount ? "warning" : "neutral",
    },
    {
      title: "Otvorené opravy",
      value: aggregates.openRepairCount,
      subtitle: `${aggregates.urgentRepairCount} ${pluralize(aggregates.urgentRepairCount, "urgentná oprava", "urgentné opravy", "urgentných opráv")}`,
      statusColor: aggregates.openRepairCount ? "error" : "neutral",
      icon: Wrench,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </section>
  );
}

export function DashboardKpisSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="h-28 px-4.5 py-4.5 shadow-none">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="size-4" />
          </div>
          <Skeleton className="mt-5 h-6 w-24" />
        </Card>
      ))}
    </section>
  );
}

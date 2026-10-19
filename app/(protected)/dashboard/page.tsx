import { AppHeader } from "@/components/common/app-header";
import {
  AttentionSection,
  AttentionSectionSkeleton,
} from "@/components/dashboard/attention-section";
import {
  CashFlowSection,
  CashFlowSectionSkeleton,
} from "@/components/dashboard/cash-flow-section";
import {
  DashboardKpis,
  DashboardKpisSkeleton,
} from "@/components/dashboard/dashboard-kpis";
import {
  RecentProperties,
  RecentPropertiesSkeleton,
} from "@/components/dashboard/recent-properties";
import { requireUser } from "@/lib/auth";
import { Bell } from "lucide-react";
import { Suspense } from "react";

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();
  const currentMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const nextMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  );
  const twelveMonthsAgo = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1),
  );
  const dates = { now, currentMonth, nextMonth, twelveMonthsAgo };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Prehľad"
        subtitle="Tu máte prehľad o svojich bytoch a nájmoch."
        primaryAction={{
          label: "Pridať nový byt",
          href: "/properties/new",
        }}
      >
        <Bell className="size-4 text-muted-foreground" />
      </AppHeader>

      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:gap-8 lg:p-8 *:shrink-0">
        <Suspense fallback={<DashboardKpisSkeleton />}>
          <DashboardKpis userId={user.id} {...dates} />
        </Suspense>

        <Suspense fallback={<AttentionSectionSkeleton />}>
          <AttentionSection userId={user.id} {...dates} />
        </Suspense>

        <Suspense fallback={<CashFlowSectionSkeleton />}>
          <CashFlowSection userId={user.id} {...dates} />
        </Suspense>

        <Suspense fallback={<RecentPropertiesSkeleton />}>
          <RecentProperties userId={user.id} {...dates} />
        </Suspense>
      </main>
    </div>
  );
}

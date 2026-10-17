import { AppHeader } from "@/components/app-header";
import { AttentionSectionSkeleton } from "@/components/dashboard/attention-section";
import { CashFlowSectionSkeleton } from "@/components/dashboard/cash-flow-section";
import { DashboardKpisSkeleton } from "@/components/dashboard/dashboard-kpis";
import { RecentPropertiesSkeleton } from "@/components/dashboard/recent-properties";

export default function Loading() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Prehľad"
        subtitle="Tu máte prehľad o svojich bytoch a nájmoch."
      />

      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:gap-8 lg:p-8 *:shrink-0">
        <DashboardKpisSkeleton />
        <AttentionSectionSkeleton />
        <CashFlowSectionSkeleton />
        <RecentPropertiesSkeleton />
      </main>
    </div>
  );
}

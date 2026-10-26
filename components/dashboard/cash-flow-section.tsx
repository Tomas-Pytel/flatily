import dynamic from "next/dynamic";

import Skeleton from "@/components/common/loading-skeleton";
import { getDashboardAggregates } from "@/lib/dashboard";
import type {
  CashFlowPoint,
  CashFlowRange,
} from "@/components/dashboard/cash-flow-chart";

const CashFlowChart = dynamic(
  () =>
    import("@/components/dashboard/cash-flow-chart").then(
      (module) => module.CashFlowChart,
    ),
  { loading: () => <CashFlowSectionSkeleton /> },
);

type CashFlowSectionProps = {
  userId: string;
  now: Date;
  currentMonth: Date;
  nextMonth: Date;
  twelveMonthsAgo: Date;
};

export async function CashFlowSection({
  userId,
  now,
  currentMonth,
  nextMonth,
  twelveMonthsAgo,
}: CashFlowSectionProps) {
  const aggregates = await getDashboardAggregates({
    userId,
    now,
    currentMonth,
    nextMonth,
    twelveMonthsAgo,
  });
  const monthLabel = (date: Date) =>
    date.toLocaleDateString("sk-SK", { month: "short" }).replace(".", "");
  const last12: CashFlowPoint[] = aggregates.cashFlow.map((row) => ({
    label: monthLabel(row.period),
    income: row.income,
    expenses: row.expenses,
  }));
  const cashFlow: Record<CashFlowRange, CashFlowPoint[]> = {
    "6months": last12.slice(-6),
    "12months": last12,
    thisYear: last12.filter(
      (_, index) =>
        aggregates.cashFlow[index]?.period.getUTCFullYear() ===
        now.getUTCFullYear(),
    ),
  };

  return (
    <section>
      <CashFlowChart data={cashFlow} />
    </section>
  );
}

export function CashFlowSectionSkeleton() {
  return <Skeleton className="h-88.25 w-full rounded-xl" />;
}

import dynamic from "next/dynamic";

import Skeleton from "@/components/common/loading-skeleton";
import { getCashFlow } from "@/lib/dashboard";
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
  nextMonth,
  twelveMonthsAgo,
}: CashFlowSectionProps) {
  const cashFlowRows = await getCashFlow({
    userId,
    now,
    nextMonth,
    twelveMonthsAgo,
  });
  const monthLabel = (date: Date) =>
    date.toLocaleDateString("sk-SK", { month: "short" }).replace(".", "");
  const last12: CashFlowPoint[] = cashFlowRows.map((row) => ({
    label: monthLabel(row.period),
    income: row.income,
    expenses: row.expenses,
  }));
  const cashFlow: Record<CashFlowRange, CashFlowPoint[]> = {
    "6months": last12.slice(-6),
    "12months": last12,
    thisYear: last12.filter(
      (_, index) =>
        cashFlowRows[index]?.period.getUTCFullYear() ===
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

import { AlertCircle, Clock4 } from "lucide-react";

import {
  AttentionCard,
  type AttentionCardProps,
} from "@/components/dashboard/attention-card";
import { Card } from "@/components/ui/card";
import Skeleton from "@/components/common/loading-skeleton";
import { getAttentionItems } from "@/lib/dashboard";

type AttentionSectionProps = {
  userId: string;
  now: Date;
  nextMonth: Date;
  twelveMonthsAgo: Date;
};

const formatAmount = (amount: number) =>
  `${Math.round(amount).toLocaleString("sk-SK")} €`;

export async function AttentionSection({
  userId,
  now,
  nextMonth,
  twelveMonthsAgo,
}: AttentionSectionProps) {
  const attentionItems = await getAttentionItems({
    userId,
    now,
    nextMonth,
    twelveMonthsAgo,
  });
  const daysFromNow = (date: Date) =>
    Math.ceil((date.getTime() - now.getTime()) / 86_400_000);
  const cards: AttentionCardProps[] = attentionItems.map((item) => {
    if (item.type === "overdue") {
      return {
        tone: "error",
        badgeStatus: "destructive",
        badgeLabel: "Omeškaný nájom",
        meta: `${Math.max(1, daysFromNow(item.dueDate) * -1)} dní po splatnosti`,
        emphasizeMeta: true,
        title: item.tenantName,
        subtitle: `${item.propertyTitle} (${item.city})`,
        amount: formatAmount(item.amount),
        icon: AlertCircle,
        action: {
          label: "Zobraziť byt",
          href: `/properties/${item.propertyId}`,
        },
      };
    }
    if (item.type === "expiringLease") {
      return {
        tone: "warning",
        badgeStatus: "warning",
        badgeLabel: "Končiaca zmluva",
        meta: `o ${daysFromNow(item.endDate)} dní`,
        emphasizeMeta: true,
        title: item.tenantName,
        subtitle: `${item.propertyTitle} (${item.city})`,
        icon: Clock4,
        action: {
          label: "Zobraziť byt",
          href: `/properties/${item.propertyId}`,
        },
      };
    }
    return {
      tone: "error",
      badgeStatus: "destructive",
      badgeLabel: "Urgentná oprava",
      meta: `Nahlásené pred ${Math.max(1, daysFromNow(item.createdAt) * -1)} dňami`,
      title: item.repairTitle,
      subtitle: `${item.propertyTitle} (${item.city})`,
      icon: AlertCircle,
      description: item.description ?? undefined,
      action: { label: "Zobraziť byt", href: `/properties/${item.propertyId}` },
    };
  });

  return (
    <section>
      <div className="mb-3.5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground">
            Vyžaduje vašu pozornosť
          </h3>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium tabular-nums text-destructive">
            {cards.length} úlohy
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Zoradené podľa naliehavosti
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <AttentionCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}

export function AttentionSectionSkeleton() {
  return (
    <section>
      <div className="mb-3.5 flex justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-44 p-4.5 shadow-none">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-4 h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-28" />
            <Skeleton className="mt-7 h-8 w-full" />
          </Card>
        ))}
      </div>
    </section>
  );
}

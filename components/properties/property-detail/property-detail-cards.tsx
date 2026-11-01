import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { PropertyDetail } from "@/types/property";

export interface PropertyDetailProps {
  property: PropertyDetail;
}

interface SummaryCardProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

interface DetailValueProps {
  label: string;
  value: string;
}

interface EmptyPanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const currencyFormatter = new Intl.NumberFormat("sk-SK", {
  style: "currency",
  currency: "EUR",
});

export const dateFormatter = new Intl.DateTimeFormat("sk-SK", {
  dateStyle: "medium",
});

export function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <Card className="min-w-0 rounded-lg p-3.5 shadow-none">
      <div className="flex min-w-0 items-center gap-2">
        <div className="shrink-0 rounded-md bg-primary/10 p-1 text-primary">
          <Icon aria-hidden="true" className="size-3.5" />
        </div>
        <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">
          {label}
        </div>
      </div>
      <div className="mt-1 truncate text-base font-bold text-neutral-900 dark:text-neutral-100">
        {value}
      </div>
      <div className="mt-1 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        {description}
      </div>
    </Card>
  );
}

export function DetailValue({ label, value }: DetailValueProps) {
  return (
    <Card className="rounded-lg bg-neutral-50 p-3 shadow-none dark:bg-neutral-900">
      <span className="block text-xs text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      <strong className="mt-1 block text-sm text-neutral-900 dark:text-neutral-100">
        {value}
      </strong>
    </Card>
  );
}

export function EmptyPanel({ icon: Icon, title, description }: EmptyPanelProps) {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center rounded-xl border-dashed px-6 py-10 text-center shadow-none">
      <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="mt-1 max-w-lg text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </Card>
  );
}

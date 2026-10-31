import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
    isWarning?: boolean;
  };
  statusColor?: "success" | "warning" | "error" | "neutral";
  icon?: LucideIcon;
  /** When set, the card navigates to this URL. Look is unchanged. */
  href?: string;
  className?: string;
}

// Border accent only for urgent states, neutral otherwise
const statusBorder = {
  error: "border-destructive/70",
  warning: "border-warning/70",
  success: "border-success/70",
  neutral: "border-border",
} as const;

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  statusColor = "neutral",
  icon: Icon,
  href,
  className,
}: KpiCardProps) {
  const trendTone = trend?.isPositive
    ? "text-success"
    : trend?.isNegative
      ? "text-destructive"
      : trend?.isWarning
        ? "text-warning"
        : "text-foreground/80";

  const card = (
    <Card
      className={cn(
        "flex h-full flex-col justify-between gap-0 px-4.5 py-4.5 shadow-none",
        statusBorder[statusColor],
        !href && className,
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        {Icon && <Icon className="size-4 text-muted-foreground/70" />}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {value}
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {trend && (
              <span className={cn("font-semibold tabular-nums", trendTone)}>
                {trend.value}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      {card}
    </Link>
  );
}

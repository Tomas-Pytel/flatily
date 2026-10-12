import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // adjust path
import { cn } from "@/lib/utils";

type Tone = "error" | "warning";

const TONE_STYLES: Record<Tone, { border: string; meta: string }> = {
  error: { border: "border-destructive/30", meta: "text-destructive" },
  warning: { border: "border-warning/30", meta: "text-warning" },
};

export type AttentionCardProps = {
  tone: Tone;
  badgeStatus: ComponentProps<typeof Badge>["variant"];
  badgeLabel: string;
  /** Right side of the badge row, e.g. "5 dní po splatnosti" */
  meta: string;
  /** Use the tone colour for meta; otherwise muted */
  emphasizeMeta?: boolean;
  title: string;
  subtitle: string;
  /** Large figure, e.g. "€650" */
  amount?: string;
  description?: ReactNode;
  action: { label: string; href: string };
  className?: string;
  icon?: LucideIcon;
};

export function AttentionCard({
  tone,
  badgeStatus,
  badgeLabel,
  meta,
  emphasizeMeta = false,
  title,
  subtitle,
  amount,
  description,
  action,
  className,
  icon: Icon,
}: AttentionCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <Card
      className={cn(
        "h-full flex flex-col justify-between gap-0 rounded-xl p-4.5 shadow-none",
        styles.border,
        className,
      )}
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <Badge variant={badgeStatus} className="gap-2 rounded-full">
            {Icon && <Icon className="size-4 " />}
            {badgeLabel}
          </Badge>
          <span
            className={cn(
              "text-xs tabular-nums",
              emphasizeMeta
                ? cn("font-medium", styles.meta)
                : "text-muted-foreground",
            )}
          >
            {meta}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>

        {amount && (
          <div
            className={cn("mt-3 text-lg font-bold tabular-nums", styles.meta)}
          >
            {amount}
          </div>
        )}
        {description && (
          <p className="mt-3 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <Button asChild size="sm" className="w-full text-xs">
          <Link href={action.href}>
            <span>{action.label}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

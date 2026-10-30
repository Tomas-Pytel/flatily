import type { ComponentProps } from "react";
import { AlertCircle, CheckCircle2, Clock3, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/property";

const paymentStatusToBadge: Record<
  PaymentStatus,
  {
    variant: ComponentProps<typeof Badge>["variant"];
    icon: LucideIcon;
  }
> = {
  Uhradené: {
    variant: "success",
    icon: CheckCircle2,
  },
  Čakajúce: {
    variant: "default",
    icon: Clock3,
  },
  Omeškané: {
    variant: "destructive",
    icon: AlertCircle,
  },
};

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  const { variant, icon: Icon } = paymentStatusToBadge[status];

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)}>
      <Icon className="size-3" />
      {status}
    </Badge>
  );
}

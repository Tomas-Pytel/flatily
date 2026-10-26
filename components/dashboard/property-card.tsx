import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/property";

type PropertyCardProps = {
  id: string | number;
  name: string;
  city: string;
  district: string;
  photoUrl?: string | null;
  rentAmount: number;
  area: number;
  rooms: number;
  tenantName?: string | null;
  paymentStatus?: PaymentStatus | null;
  href?: string;
  className?: string;
};

export function PropertyCard({
  id,
  name,
  city,
  district,
  photoUrl,
  rentAmount,
  area,
  rooms,
  tenantName,
  paymentStatus,
  href = `/properties/${id}`,
  className,
}: PropertyCardProps) {
  return (
    <Card
      className={cn(
        "group h-full gap-0 overflow-hidden py-0 shadow-xs transition-colors hover:border-foreground/20",
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            referrerPolicy="no-referrer"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground">
            <Building2 className="size-8 opacity-20" />
            <span className="text-xs font-medium">Žiadny obrázok</span>
          </div>
        )}
      </div>

      <CardHeader className="gap-0.5 px-4 pb-0 pt-4">
        <CardTitle className="truncate text-sm">{name}</CardTitle>
        <CardDescription className="text-xs">
          {city} - {district}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 px-4 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-base font-bold tabular-nums text-foreground">
            €{rentAmount.toLocaleString("sk-SK")}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              / mes.
            </span>
          </div>
          <div className="text-xs tabular-nums text-muted-foreground">
            {area} m² · {rooms} izb.
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
          <div className="min-w-0 truncate text-muted-foreground">
            {tenantName ?? "Voľný byt"}
          </div>
          {paymentStatus ? (
            <PaymentStatusBadge status={paymentStatus} />
          ) : (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              Bez platby
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-4">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="w-full text-xs"
        >
          <Link href={href}>
            <span>Detail bytu</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

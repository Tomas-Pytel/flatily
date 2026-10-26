import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DeletePropertyButton } from "@/components/properties/delete-property-button";
import type { PropertyListItem } from "@/types/property";

export type BadgeStatus = ComponentProps<typeof Badge>["variant"];
type PaymentStatus = "Uhradené" | "Čakajúce" | "Omeškané";

const paymentStatusToBadge: Record<
  PaymentStatus,
  {
    variant: BadgeStatus;
    icon: LucideIcon;
  }
> = {
  Uhradené: {
    variant: "success",
    icon: CheckCircle2,
  },
  Omeškané: {
    variant: "destructive",
    icon: AlertCircle,
  },
  Čakajúce: {
    variant: "default",
    icon: Clock3,
  },
};

type ExtendedPropertyCardProps = {
  property: PropertyListItem;
  href?: string;
  className?: string;
};

export function ExtendedPropertyCard({
  property,
  href,
  className,
}: ExtendedPropertyCardProps) {
  const {
    id,
    name,
    address,
    city,
    district,
    photoUrl,
    rentAmount,
    utilitiesAmount,
    area,
    rooms,
    floor,
    totalFloors,
    tenantName,
    paymentStatus,
    openRepairsCount,
  } = property;
  const propertyHref = href ?? `/properties/${id}`;
  const PaymentIcon = paymentStatus
    ? paymentStatusToBadge[paymentStatus].icon
    : null;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col justify-between overflow-hidden shadow-xs transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <div>
        {/* Fotografia a Overlaye */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              referrerPolicy="no-referrer"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground">
              <Building2 className="size-8 opacity-20" />
              <span className="text-xs font-medium">Žiadny obrázok</span>
            </div>
          )}

          {/* Technické štatistiky (vľavo dole) */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs tabular-nums text-white backdrop-blur-sm">
            <span>{area} m²</span>
            <span>·</span>
            <span>{rooms} izb.</span>
            {floor !== undefined && totalFloors !== undefined && (
              <>
                <span>·</span>
                <span>
                  Posch. {floor}/{totalFloors}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Informačná časť */}
        <CardContent className="space-y-3 p-4">
          {/* Názov a Adresa */}
          <div>
            <Link
              href={propertyHref}
              className="text-base font-semibold text-foreground transition-colors hover:text-primary"
            >
              {name}
            </Link>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {address ? `${address}, ` : ""}
                {city} – {district}
              </span>
            </div>
          </div>

          {/* Finančné detaily */}
          <div className="flex items-baseline justify-between border-t border-border pt-2">
            <div>
              <div className="text-xs text-muted-foreground">Mesačný nájom</div>
              <div className="text-lg font-bold tabular-nums text-foreground">
                €{rentAmount.toLocaleString("sk-SK")}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  / mes.
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Energie</div>
              <div className="text-sm font-semibold tabular-nums text-foreground">
                +€{utilitiesAmount.toLocaleString("sk-SK")}
              </div>
            </div>
          </div>

          {/* Nájomník a Platba */}
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
            <div>
              <span className="text-muted-foreground">Nájomník: </span>
              {tenantName ? (
                <span className="font-medium text-foreground">
                  {tenantName}
                </span>
              ) : (
                <span className="font-medium text-warning">Voľný</span>
              )}
            </div>

            <div>
              {paymentStatus ? (
                <Badge
                  variant={paymentStatusToBadge[paymentStatus].variant}
                  className="gap-1.5 border-0 font-medium px-2 py-0.5"
                >
                  {PaymentIcon && <PaymentIcon className="size-3" />}
                  {paymentStatus}
                </Badge>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  Bez záznamu
                </span>
              )}
            </div>
          </div>

          {/* Indikátor Opráv */}
          {openRepairsCount > 0 && (
            <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-destructive">
              <AlertCircle className="size-3.5" />
              <span>Otvorené opravy ({openRepairsCount})</span>
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer Akcie */}
      <div className="flex items-center gap-2 px-4 pb-4 pt-0">
        <Button asChild className="flex-1 text-xs font-medium shadow-xs">
          <Link href={propertyHref}>
            Detail bytu
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </Button>

        <DeletePropertyButton propertyId={id} propertyName={name} />
      </div>
    </Card>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";

import { PropertyCard } from "@/components/dashboard/property-card";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<typeof PropertyCard>;

// Adjust to your real types. These mirror the fields used in your snippet.
type Apartment = Pick<
  CardProps,
  | "id"
  | "name"
  | "city"
  | "district"
  | "photoUrl"
  | "status"
  | "rentAmount"
  | "area"
  | "rooms"
> & { currentTenantId?: string | number | null };

type Tenant = { id: string | number; firstName: string; lastName: string };

type Payment = {
  apartmentId: Apartment["id"];
  period: string;
  status: NonNullable<CardProps["paymentStatus"]>;
};

type MyPropertiesProps = {
  apartments: Apartment[];
  tenants: Tenant[];
  payments: Payment[];
  /** Payment period to show, e.g. "Október 2026" */
  period: string;
  /** Max cards shown. Defaults to 4 */
  limit?: number;
  /** Defaults to /properties */
  allHref?: string;
  className?: string;
};

export function MyProperties({
  apartments,
  tenants,
  payments,
  period,
  limit = 4,
  allHref = "/properties",
  className,
}: MyPropertiesProps) {
  return (
    <section className={cn(className)}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Moje byty</h3>
          <p className="text-xs text-muted-foreground">
            Rýchly prehľad spravovaných jednotiek
          </p>
        </div>

        <Link
          href={allHref}
          className="inline-flex items-center gap-1 self-start rounded-sm text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:self-auto"
        >
          <span>Všetky byty ({apartments.length})</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {apartments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-10 text-center text-xs text-muted-foreground">
          Zatiaľ nemáte pridané žiadne byty
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {apartments.slice(0, limit).map((apt) => {
            const tenant = tenants.find((t) => t.id === apt.currentTenantId);
            const payment = payments.find(
              (p) => p.apartmentId === apt.id && p.period === period,
            );

            return (
              <PropertyCard
                key={apt.id}
                id={apt.id}
                name={apt.name}
                city={apt.city}
                district={apt.district}
                photoUrl={apt.photoUrl}
                status={apt.status}
                rentAmount={apt.rentAmount}
                area={apt.area}
                rooms={apt.rooms}
                tenantName={
                  tenant ? `${tenant.firstName} ${tenant.lastName}` : null
                }
                paymentStatus={payment?.status ?? null}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

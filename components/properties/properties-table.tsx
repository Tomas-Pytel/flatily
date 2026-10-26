import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";
import { DeletePropertyButton } from "@/components/properties/delete-property-button";
import type { PropertyListItem } from "@/types/property";

type BadgeVariant = ComponentProps<typeof Badge>["variant"];

const propertyStatusLabels: Record<
  PropertyListItem["status"],
  { label: string; variant: BadgeVariant }
> = {
  obsadeny: { label: "Obsadený", variant: "default" },
  volny: { label: "Voľný", variant: "warning" },
};

export function PropertiesTable({
  properties,
}: {
  properties: PropertyListItem[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-[#141414]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
            <tr>
              <th className="px-4 py-3">Byt</th>
              <th className="px-4 py-3">Lokalita</th>
              <th className="px-4 py-3">Parametre</th>
              <th className="px-4 py-3 text-right">Mesačný nájom</th>
              <th className="px-4 py-3">Nájomník</th>
              <th className="px-4 py-3">Platba</th>
              <th className="px-4 py-3">Stav</th>
              <th className="px-4 py-3 text-right">Akcie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {properties.map((property) => (
              <tr
                key={property.id}
                className="transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
              >
                <td className="px-4 py-3.5">
                  <Link
                    href={`/properties/${property.id}`}
                    className="flex items-center gap-2.5 font-semibold text-neutral-900 hover:text-[#004AAD] dark:text-neutral-100 dark:hover:text-[#3B82F6]"
                  >
                    {property.photoUrl ? (
                      <Image
                        src={property.photoUrl}
                        alt={`Náhľad nehnuteľnosti ${property.name}`}
                        width={32}
                        height={32}
                        sizes="32px"
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">
                        <Building2 className="size-5 opacity-40" />
                      </div>
                    )}

                    <span>{property.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400">
                  {property.address}, {property.city}
                </td>
                <td className="px-4 py-3.5 tabular-nums text-neutral-500">
                  {property.area} m² · {property.rooms} izb.
                </td>
                <td className="px-4 py-3.5 text-right font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                  €{property.rentAmount.toLocaleString("sk-SK")}
                </td>
                <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                  {property.tenantName ?? "—"}
                </td>
                <td className="px-4 py-3.5">
                  {property.paymentStatus ? (
                    <PaymentStatusBadge status={property.paymentStatus} />
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={propertyStatusLabels[property.status].variant}>
                    {propertyStatusLabels[property.status].label}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/properties/${property.id}`}
                      className="rounded-md p-1.5 text-[#004AAD] hover:bg-neutral-100 dark:text-[#3B82F6] dark:hover:bg-neutral-800"
                      title="Detail"
                      aria-label={`Otvoriť detail nehnuteľnosti ${property.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <DeletePropertyButton
                      propertyId={property.id}
                      propertyName={property.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

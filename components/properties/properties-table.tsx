import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";
import { DeletePropertyButton } from "@/components/properties/delete-property-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <Table className="text-left text-xs">
        <TableHeader className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          <TableRow className="border-neutral-200 dark:border-neutral-800">
            <TableHead className="px-4 py-3">Byt</TableHead>
            <TableHead className="px-4 py-3">Lokalita</TableHead>
            <TableHead className="px-4 py-3">Parametre</TableHead>
            <TableHead className="px-4 py-3 text-right">Mesačný nájom</TableHead>
            <TableHead className="px-4 py-3">Nájomník</TableHead>
            <TableHead className="px-4 py-3">Platba</TableHead>
            <TableHead className="px-4 py-3">Stav</TableHead>
            <TableHead className="px-4 py-3 text-right">Akcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {properties.map((property) => (
            <TableRow
              key={property.id}
              className="border-0 transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
            >
              <TableCell className="px-4 py-3.5">
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
              </TableCell>
              <TableCell className="whitespace-normal px-4 py-3.5 text-neutral-600 dark:text-neutral-400">
                {property.address}, {property.city}
              </TableCell>
              <TableCell className="px-4 py-3.5 tabular-nums text-neutral-500">
                {property.area} m² · {property.rooms} izb.
              </TableCell>
              <TableCell className="px-4 py-3.5 text-right font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                €{property.rentAmount.toLocaleString("sk-SK")}
              </TableCell>
              <TableCell className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                {property.tenantName ?? "—"}
              </TableCell>
              <TableCell className="px-4 py-3.5">
                {property.paymentStatus ? (
                  <PaymentStatusBadge status={property.paymentStatus} />
                ) : (
                  <span className="text-neutral-400">—</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3.5">
                <Badge variant={propertyStatusLabels[property.status].variant}>
                  {propertyStatusLabels[property.status].label}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-sm"
                    className="text-[#004AAD] hover:bg-neutral-100 dark:text-[#3B82F6] dark:hover:bg-neutral-800"
                  >
                    <Link
                      href={`/properties/${property.id}`}
                      title="Detail"
                      aria-label={`Otvoriť detail nehnuteľnosti ${property.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeletePropertyButton
                    propertyId={property.id}
                    propertyName={property.name}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

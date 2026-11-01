"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Search, Users } from "lucide-react";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaymentStatus } from "@/types/property";

export type TenantListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  propertyName: string | null;
  rentAmount: number | null;
  leaseStatus: "Aktívna" | "Ukončená" | null;
  paymentStatus: PaymentStatus | null;
  leaseEndDate: string | null;
};

export function TenantsView({
  tenants,
  paymentPeriodLabel,
}: {
  tenants: TenantListItem[];
  paymentPeriodLabel: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("sk");
  const filteredTenants = tenants.filter((tenant) =>
    [
      tenant.firstName,
      tenant.lastName,
      tenant.email,
      tenant.phone ?? "",
    ].some((value) => value.toLocaleLowerCase("sk").includes(normalizedQuery)),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#141414] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Zoznam nájomníkov ({tenants.length})
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Aktuálni nájomníci, kontaktné údaje a zmluvné vzťahy
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Hľadať nájomníka..."
            aria-label="Hľadať nájomníka"
            className="pl-9"
          />
        </div>
      </div>

      {filteredTenants.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          <Users aria-hidden="true" className="size-8 opacity-50" />
          <p className="font-medium">
            {tenants.length === 0
              ? "Zatiaľ nemáte žiadnych nájomníkov."
              : "Žiadny nájomník nezodpovedá vyhľadávaniu."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-[#141414]">
          <Table className="text-left text-xs">
            <TableHeader className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-900">
              <TableRow className="border-neutral-200 hover:bg-transparent dark:border-neutral-800">
                <TableHead className="px-4 py-3 font-semibold text-neutral-500">
                  Meno
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-neutral-500">
                  Byt
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-neutral-500">
                  Kontakt
                </TableHead>
                <TableHead className="px-4 py-3 text-right font-semibold text-neutral-500">
                  Mesačný nájom
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-neutral-500">
                  Zmluva
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-neutral-500">
                  Platba ({paymentPeriodLabel})
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold text-neutral-500">
                  Koniec zmluvy
                </TableHead>
                <TableHead className="px-4 py-3 text-right font-semibold text-neutral-500">
                  Akcia
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredTenants.map((tenant) => (
                <TableRow
                  key={tenant.id}
                  className="border-0 transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
                >
                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        aria-hidden="true"
                        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#004AAD]/10 text-xs font-semibold text-[#004AAD] dark:bg-[#3B82F6]/20 dark:text-[#3B82F6]"
                      >
                        {tenant.firstName.charAt(0)}
                        {tenant.lastName.charAt(0)}
                      </div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {tenant.firstName} {tenant.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                    {tenant.propertyName ?? (
                      <span className="text-neutral-400">Bez bytu</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-neutral-500">
                    <div>{tenant.email}</div>
                    <div className="text-[11px] text-neutral-400">
                      {formatPhoneNumber(tenant.phone)}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-right font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                    {tenant.rentAmount === null
                      ? "—"
                      : `€${tenant.rentAmount.toLocaleString("sk-SK", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    {tenant.leaseStatus ? (
                      <Badge
                        variant={
                          tenant.leaseStatus === "Aktívna"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {tenant.leaseStatus}
                      </Badge>
                    ) : (
                      <span className="text-neutral-400">Bez zmluvy</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    {tenant.paymentStatus ? (
                      <PaymentStatusBadge status={tenant.paymentStatus} />
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 tabular-nums text-neutral-600 dark:text-neutral-400">
                    {tenant.leaseEndDate ?? "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon-sm"
                      className="text-[#004AAD] hover:bg-neutral-100 hover:text-[#004AAD] dark:text-[#3B82F6] dark:hover:bg-neutral-800 dark:hover:text-[#3B82F6]"
                    >
                      <Link
                        href={`/tenants/${tenant.id}/update`}
                        title={`Upraviť nájomníka ${tenant.firstName} ${tenant.lastName}`}
                        aria-label={`Upraviť nájomníka ${tenant.firstName} ${tenant.lastName}`}
                      >
                        <Pencil aria-hidden="true" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

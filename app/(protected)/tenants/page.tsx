import { AppHeader } from "@/components/common/app-header";
import { Bell } from "lucide-react";
import { TenantsView, type TenantListItem } from "@/components/tenants/tenants-view";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPaymentStatus } from "@/lib/payments";
import { getToday, isLeaseInEffect } from "@/lib/utils";

export default async function TenantsPage() {
  const user = await requireUser();
  const today = getToday();
  const paymentPeriod = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
  );
  const tenantRows = await prisma.tenant.findMany({
    where: { ownerId: user.id },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      leases: {
        where: { status: "ACTIVE" },
        orderBy: { startDate: "desc" },
        take: 1,
        select: {
          endDate: true,
          autoRenew: true,
          rentAmount: true,
          property: { select: { title: true } },
          charges: {
            where: {
              OR: [{ period: paymentPeriod }, { dueDate: { lt: today } }],
            },
            select: {
              period: true,
              dueDate: true,
              amount: true,
              payments: { select: { amount: true } },
            },
          },
        },
      },
    },
  });
  const tenants: TenantListItem[] = tenantRows.map((tenant) => {
    const lease = tenant.leases[0];
    return {
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone,
      propertyName: lease?.property.title ?? null,
      rentAmount: lease ? Number(lease.rentAmount) : null,
      leaseStatus: lease
        ? isLeaseInEffect(lease, today)
          ? "Aktívna"
          : "Ukončená"
        : null,
      paymentStatus: lease
        ? getPaymentStatus(lease.charges, paymentPeriod, today)
        : null,
      leaseEndDate: lease
        ? new Intl.DateTimeFormat("sk-SK", { timeZone: "UTC" }).format(
            lease.endDate,
          )
        : null,
    };
  });
  const paymentPeriodLabel = new Intl.DateTimeFormat("sk-SK", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(paymentPeriod);

  return (
    <div className="flex h-full flex-col">
      {/*Header */}
      <AppHeader
        title="Nájomníci"
        subtitle="Prehľad nájomníkov, kontaktných údajov a zmluvných vzťahov."
        primaryAction={{
          label: "Pridať nájomníka",
          href: "/tenants/new",
        }}
      >
        <Bell className="size-4 text-muted-foreground/70" />
      </AppHeader>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <TenantsView
          tenants={tenants}
          paymentPeriodLabel={paymentPeriodLabel}
        />
      </main>
    </div>
  );
}

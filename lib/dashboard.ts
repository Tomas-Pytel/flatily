import { Prisma } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";

type DashboardAggregateRow = {
  propertyCount: number;
  occupiedPropertyCount: number;
  monthlyIncome: string | number;
  currentRent: string | number;
  overdueAmount: string | number;
  overdueCount: number;
  openRepairCount: number;
  urgentRepairCount: number;
};

type CashFlowAggregateRow = {
  period: Date;
  income: string | number;
  expenses: string | number;
};

export type DashboardSummary = {
  propertyCount: number;
  occupiedPropertyCount: number;
  monthlyIncome: number;
  currentRent: number;
  overdueAmount: number;
  overdueCount: number;
  openRepairCount: number;
  urgentRepairCount: number;
};

export type DashboardProperty = {
  id: string;
  name: string;
  city: string;
  district: string;
  photoUrl: string | null;
  rentAmount: number;
  area: number;
  rooms: number;
  tenant: { id: string; firstName: string; lastName: string } | null;
  payment: {
    amount: number;
    dueDate: Date;
    paidAmount: number;
  } | null;
};

export type DashboardAttentionItem =
  | {
      type: "overdue";
      propertyId: string;
      propertyTitle: string;
      city: string;
      tenantName: string;
      amount: number;
      dueDate: Date;
    }
  | {
      type: "expiringLease";
      propertyId: string;
      propertyTitle: string;
      city: string;
      tenantName: string;
      endDate: Date;
    }
  | {
      type: "urgentRepair";
      propertyId: string;
      propertyTitle: string;
      city: string;
      repairTitle: string;
      description: string | null;
      createdAt: Date;
    };

const numeric = (value: string | number) =>
  typeof value === "number" ? value : Number(value);

export async function getRecentProperties({
  userId,
  currentMonth,
  nextMonth,
}: {
  userId: string;
  currentMonth: Date;
  nextMonth: Date;
}): Promise<{ properties: DashboardProperty[]; totalCount: number }> {
  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: userId },
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        city: true,
        district: true,
        monthlyRent: true,
        area: true,
        rooms: true,
        images: {
          where: { isCover: true },
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
        leases: {
          where: { status: "ACTIVE" },
          orderBy: { startDate: "desc" },
          take: 1,
          select: {
            tenant: { select: { id: true, firstName: true, lastName: true } },
            charges: {
              where: { period: { gte: currentMonth, lt: nextMonth } },
              take: 1,
              select: {
                amount: true,
                dueDate: true,
                payments: { select: { amount: true } },
              },
            },
          },
        },
      },
    }),
    prisma.property.count({ where: { ownerId: userId } }),
  ]);

  return {
    properties: properties.map((property) => {
      const lease = property.leases[0];
      const charge = lease?.charges[0];

      return {
        id: property.id,
        name: property.title,
        city: property.city,
        district: property.district ?? "",
        photoUrl: property.images[0]?.url ?? null,
        rentAmount: Number(property.monthlyRent),
        area: Number(property.area),
        rooms: property.rooms,
        tenant: lease?.tenant ?? null,
        payment: charge
          ? {
              amount: Number(charge.amount),
              dueDate: charge.dueDate,
              paidAmount: charge.payments.reduce(
                (sum, payment) => sum.plus(payment.amount),
                new Prisma.Decimal(0),
              ).toNumber(),
            }
          : null,
      };
    }),
    totalCount,
  };
}

export async function getAttentionItems({
  userId,
  now,
  nextMonth,
  twelveMonthsAgo,
}: {
  userId: string;
  now: Date;
  nextMonth: Date;
  twelveMonthsAgo: Date;
}): Promise<DashboardAttentionItem[]> {
  const properties = await prisma.property.findMany({
    where: { ownerId: userId },
    select: {
      id: true,
      title: true,
      city: true,
      leases: {
        where: { status: "ACTIVE" },
        orderBy: { startDate: "desc" },
        take: 1,
        select: {
          endDate: true,
          tenant: { select: { firstName: true, lastName: true } },
          charges: {
            where: {
              period: {
                gte: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
                lt: nextMonth,
              },
            },
            select: {
              amount: true,
              dueDate: true,
              payments: { select: { amount: true } },
            },
          },
        },
      },
      maintenance: {
        where: {
          createdAt: { gte: twelveMonthsAgo },
          status: { not: "RESOLVED" },
          priority: "URGENT",
        },
        select: {
          title: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });

  const items: DashboardAttentionItem[] = [];
  for (const property of properties) {
    const lease = property.leases[0];
    const tenantName = lease
      ? `${lease.tenant.firstName} ${lease.tenant.lastName}`
      : "";

    if (lease) {
      const daysToEnd = Math.ceil(
        (lease.endDate.getTime() - now.getTime()) / 86_400_000,
      );
      if (daysToEnd >= 0 && daysToEnd <= 30) {
        items.push({
          type: "expiringLease",
          propertyId: property.id,
          propertyTitle: property.title,
          city: property.city,
          tenantName,
          endDate: lease.endDate,
        });
      }

      for (const charge of lease.charges) {
        const paidAmount = charge.payments.reduce(
          (sum, payment) => sum.plus(payment.amount),
          new Prisma.Decimal(0),
        );
        if (charge.dueDate < now && paidAmount.lt(charge.amount)) {
          items.push({
            type: "overdue",
            propertyId: property.id,
            propertyTitle: property.title,
            city: property.city,
            tenantName,
            amount: new Prisma.Decimal(charge.amount).minus(paidAmount).toNumber(),
            dueDate: charge.dueDate,
          });
        }
      }
    }

    for (const repair of property.maintenance) {
      items.push({
        type: "urgentRepair",
        propertyId: property.id,
        propertyTitle: property.title,
        city: property.city,
        repairTitle: repair.title,
        description: repair.description,
        createdAt: repair.createdAt,
      });
    }
  }

  return items;
}

export async function getDashboardSummary({
  userId,
  now,
  currentMonth,
  nextMonth,
  twelveMonthsAgo,
}: {
  userId: string;
  now: Date;
  currentMonth: Date;
  nextMonth: Date;
  twelveMonthsAgo: Date;
}): Promise<DashboardSummary> {
  const summaryRows = await prisma.$queryRaw<DashboardAggregateRow[]>(Prisma.sql`
      WITH current_charges AS (
        SELECT
          rc.amount,
          rc.due_date,
          COALESCE(SUM(pay.amount), 0) AS paid_amount
        FROM rent_charges rc
        JOIN leases l ON l.id = rc.lease_id
        JOIN properties p ON p.id = l.property_id
        LEFT JOIN payments pay ON pay.charge_id = rc.id
        WHERE p.owner_id = ${userId}::uuid
          AND l.status = 'ACTIVE'
          AND rc.period >= ${currentMonth}
          AND rc.period < ${nextMonth}
        GROUP BY rc.id, rc.amount, rc.due_date
      )
      SELECT
        (SELECT COUNT(*)::int
         FROM properties p
         WHERE p.owner_id = ${userId}::uuid) AS "propertyCount",
        (SELECT COUNT(DISTINCT p.id)::int
         FROM properties p
         JOIN leases l ON l.property_id = p.id AND l.status = 'ACTIVE'
         WHERE p.owner_id = ${userId}::uuid) AS "occupiedPropertyCount",
        COALESCE((SELECT SUM(paid_amount) FROM current_charges), 0) AS "monthlyIncome",
        COALESCE((SELECT SUM(amount) FROM current_charges), 0) AS "currentRent",
        COALESCE((
          SELECT SUM(amount - paid_amount)
          FROM current_charges
          WHERE due_date < ${now}
            AND paid_amount < amount
        ), 0) AS "overdueAmount",
        (SELECT COUNT(*)::int
         FROM current_charges
         WHERE due_date < ${now}
           AND paid_amount < amount) AS "overdueCount",
        (SELECT COUNT(*)::int
         FROM maintenance_records m
         JOIN properties p ON p.id = m.property_id
         WHERE p.owner_id = ${userId}::uuid
           AND m.created_at >= ${twelveMonthsAgo}
           AND m.status <> 'RESOLVED') AS "openRepairCount",
        (SELECT COUNT(*)::int
         FROM maintenance_records m
         JOIN properties p ON p.id = m.property_id
         WHERE p.owner_id = ${userId}::uuid
           AND m.created_at >= ${twelveMonthsAgo}
           AND m.status <> 'RESOLVED'
           AND m.priority = 'URGENT') AS "urgentRepairCount"
    `);

  const summary = summaryRows[0];
  if (!summary) {
    throw new Error("Nepodarilo sa načítať agregácie dashboardu.");
  }

  return {
    propertyCount: summary.propertyCount,
    occupiedPropertyCount: summary.occupiedPropertyCount,
    monthlyIncome: numeric(summary.monthlyIncome),
    currentRent: numeric(summary.currentRent),
    overdueAmount: numeric(summary.overdueAmount),
    overdueCount: summary.overdueCount,
    openRepairCount: summary.openRepairCount,
    urgentRepairCount: summary.urgentRepairCount,
  };
}

export async function getCashFlow({
  userId,
  now,
  nextMonth,
  twelveMonthsAgo,
}: {
  userId: string;
  now: Date;
  nextMonth: Date;
  twelveMonthsAgo: Date;
}): Promise<Array<{ period: Date; income: number; expenses: number }>> {
  const cashFlowRows = await prisma.$queryRaw<CashFlowAggregateRow[]>(Prisma.sql`
      WITH months AS (
        SELECT generate_series(
          date_trunc('month'::text, ${twelveMonthsAgo}::timestamptz),
          date_trunc('month'::text, ${now}::timestamptz),
          interval '1 month'
        ) AS period
      ),
      income AS (
        SELECT date_trunc('month'::text, pay.paid_at::timestamptz) AS period, SUM(pay.amount) AS amount
        FROM payments pay
        JOIN rent_charges rc ON rc.id = pay.charge_id
        JOIN leases l ON l.id = rc.lease_id
        JOIN properties p ON p.id = l.property_id
        WHERE p.owner_id = ${userId}::uuid
          AND pay.paid_at >= ${twelveMonthsAgo}
          AND pay.paid_at < ${nextMonth}
        GROUP BY date_trunc('month'::text, pay.paid_at::timestamptz)
      ),
      expenses AS (
        SELECT date_trunc('month'::text, m.created_at) AS period,
               SUM(COALESCE(m.actual_cost, m.estimated_cost, 0)) AS amount
        FROM maintenance_records m
        JOIN properties p ON p.id = m.property_id
        WHERE p.owner_id = ${userId}::uuid
          AND m.created_at >= ${twelveMonthsAgo}
          AND m.created_at < ${nextMonth}
        GROUP BY date_trunc('month'::text, m.created_at)
      )
      SELECT
        months.period,
        COALESCE(income.amount, 0) AS income,
        COALESCE(expenses.amount, 0) AS expenses
      FROM months
      LEFT JOIN income ON income.period = months.period
      LEFT JOIN expenses ON expenses.period = months.period
      ORDER BY months.period
    `);

  return cashFlowRows.map((row) => ({
    period: row.period,
    income: numeric(row.income),
    expenses: numeric(row.expenses),
  }));
}

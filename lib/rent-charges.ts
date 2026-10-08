import { Prisma } from "@/lib/generated/prisma/client";
import { ChargeStatus } from "@/lib/generated/prisma/enums";
import type { PaymentStatus } from "@/types/property";

// All dates are handled as UTC calendar dates (DB columns are @db.Date).
const MAX_CHARGES = 120; // safety cap: 10 years of rent

export function monthStartUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export function todayUTC(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
}

/** One charge per calendar month from lease start to lease end (no proration). */
export function buildChargeRows(lease: {
  id: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  paymentDay: number;
}) {
  const day = Math.min(Math.max(lease.paymentDay, 1), 28);
  const last = monthStartUTC(lease.endDate);
  const rows: {
    leaseId: string;
    period: Date;
    dueDate: Date;
    amount: number;
  }[] = [];

  let period = monthStartUTC(lease.startDate);
  while (period <= last && rows.length < MAX_CHARGES) {
    rows.push({
      leaseId: lease.id,
      period,
      dueDate: new Date(
        Date.UTC(period.getUTCFullYear(), period.getUTCMonth(), day),
      ),
      amount: lease.rentAmount,
    });
    period = new Date(
      Date.UTC(period.getUTCFullYear(), period.getUTCMonth() + 1, 1),
    );
  }
  return rows;
}

export type ChargeView = "PAID" | "PARTIAL" | "OVERDUE" | "PENDING";

export function chargeView(
  c: { status: ChargeStatus; dueDate: Date },
  today: Date = todayUTC(),
): ChargeView {
  if (c.status === ChargeStatus.PAID) return "PAID";
  if (c.dueDate < today) return "OVERDUE";
  return c.status === ChargeStatus.PARTIAL ? "PARTIAL" : "PENDING";
}

/** Summary status shown on the tenant card. */
export function leasePaymentStatus(
  charges: { status: ChargeStatus; period: Date; dueDate: Date }[],
  today: Date = todayUTC(),
): PaymentStatus {
  const month = monthStartUTC(today);
  const unpaid = charges.filter(
    (c) => c.status !== ChargeStatus.PAID && c.period <= month,
  );
  if (unpaid.some((c) => c.dueDate < today)) return "Omeškané";
  if (unpaid.length > 0) return "Čakajúce";
  return "Uhradené";
}

/** Recomputes charge.status from its payments. Call inside a transaction. */
export async function syncChargeStatus(
  tx: Prisma.TransactionClient,
  chargeId: string,
) {
  const charge = await tx.rentCharge.findUniqueOrThrow({
    where: { id: chargeId },
    select: { amount: true },
  });
  const agg = await tx.payment.aggregate({
    where: { chargeId },
    _sum: { amount: true },
  });
  const paid = agg._sum.amount ?? new Prisma.Decimal(0);

  const status = paid.gte(charge.amount)
    ? ChargeStatus.PAID
    : paid.gt(0)
      ? ChargeStatus.PARTIAL
      : ChargeStatus.PENDING;

  await tx.rentCharge.update({ where: { id: chargeId }, data: { status } });
}

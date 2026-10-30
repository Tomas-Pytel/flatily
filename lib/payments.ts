import { Prisma } from "@/lib/generated/prisma/client";
import { isPastDue } from "@/lib/utils";
import type { PaymentStatus } from "@/types/property";

type ChargeWithPayments = {
  period: Date;
  dueDate: Date;
  amount: Prisma.Decimal;
  payments: { amount: Prisma.Decimal }[];
};

export function getPaymentStatus(
  charges: ChargeWithPayments[],
  currentPeriod: Date,
  today: Date,
): PaymentStatus | null {
  const isUnpaid = (charge: ChargeWithPayments) => {
    const paid = charge.payments.reduce(
      (sum, payment) => sum.plus(payment.amount),
      new Prisma.Decimal(0),
    );
    return paid.lt(charge.amount);
  };

  if (charges.some((charge) => isPastDue(charge.dueDate, today) && isUnpaid(charge))) {
    return "Omeškané";
  }

  const currentCharge = charges.find(
    (charge) => charge.period.getTime() === currentPeriod.getTime(),
  );
  if (!currentCharge) {
    return null;
  }

  return isUnpaid(currentCharge) ? "Čakajúce" : "Uhradené";
}

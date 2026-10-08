"use server";

import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { syncChargeStatus, todayUTC } from "@/lib/rent-charges";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "./property-actions";

function ownedCharge(chargeId: string, userId: string) {
  return prisma.rentCharge.findFirst({
    where: { id: chargeId, lease: { property: { ownerId: userId } } },
    select: { id: true, amount: true, lease: { select: { propertyId: true } } },
  });
}

function revalidate(propertyId: string) {
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath("/dashboard");
}

/** Records a payment for the remaining unpaid amount of the charge (today). */
export async function markChargePaid(chargeId: string): Promise<ActionResponse> {
  const user = await requireUser();
  const charge = await ownedCharge(chargeId, user.id);
  if (!charge) {
    return { success: false, error: "Predpis neexistuje alebo nemáte oprávnenie." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // remaining is computed inside the tx so a double click can't overpay
      const agg = await tx.payment.aggregate({
        where: { chargeId },
        _sum: { amount: true },
      });
      const remaining = charge.amount.minus(
        agg._sum.amount ?? new Prisma.Decimal(0),
      );
      if (remaining.lte(0)) return;

      await tx.payment.create({
        data: { chargeId, amount: remaining, paidAt: todayUTC() },
      });
      await syncChargeStatus(tx, chargeId);
    });
  } catch (error) {
    console.error("Chyba pri zápise platby", error);
    return { success: false, error: "Nepodarilo sa zapísať úhradu." };
  }

  revalidate(charge.lease.propertyId);
  return { success: true };
}

/** Removes all payments of a charge (e.g. marked paid by mistake). */
export async function undoChargePayments(
  chargeId: string,
): Promise<ActionResponse> {
  const user = await requireUser();
  const charge = await ownedCharge(chargeId, user.id);
  if (!charge) {
    return { success: false, error: "Predpis neexistuje alebo nemáte oprávnenie." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.payment.deleteMany({ where: { chargeId } });
      await syncChargeStatus(tx, chargeId);
    });
  } catch (error) {
    console.error("Chyba pri rušení úhrady", error);
    return { success: false, error: "Nepodarilo sa zrušiť úhradu." };
  }

  revalidate(charge.lease.propertyId);
  return { success: true };
}

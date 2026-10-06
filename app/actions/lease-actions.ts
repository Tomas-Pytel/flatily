"use server";

import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { LeaseStatus } from "@/lib/generated/prisma/enums";
import { monthStartUTC, todayUTC } from "@/lib/rent-charges";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "./property-actions";

/**
 * Ends an active lease as of today (clamped to the lease's own date range).
 * - lease -> ENDED, endDate = effective end date
 * - future charges without any payment are deleted
 * - charges for the current/past months stay (no proration)
 */
export async function endLease(leaseId: string): Promise<ActionResponse> {
  const user = await requireUser();

  const lease = await prisma.lease.findFirst({
    where: { id: leaseId, property: { ownerId: user.id } },
  });

  if (!lease) {
    return { success: false, error: "Zmluva neexistuje alebo nemáte oprávnenie." };
  }
  if (lease.status !== LeaseStatus.ACTIVE) {
    return { success: false, error: "Zmluva je už ukončená." };
  }

  const today = todayUTC();
  const endDate =
    today < lease.startDate
      ? lease.startDate
      : today > lease.endDate
        ? lease.endDate
        : today;

  try {
    await prisma.$transaction([
      prisma.lease.update({
        where: { id: leaseId },
        data: { status: LeaseStatus.ENDED, endDate },
      }),
      prisma.rentCharge.deleteMany({
        where: {
          leaseId,
          period: { gt: monthStartUTC(endDate) },
          payments: { none: {} },
        },
      }),
    ]);
  } catch (error) {
    console.error("Chyba pri ukončení zmluvy", error);
    return { success: false, error: "Nepodarilo sa ukončiť zmluvu." };
  }

  revalidatePath(`/properties/${lease.propertyId}`);
  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}

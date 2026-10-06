"use server";

import { requireUser } from "@/lib/auth";
import { TenantFormValues, tenantSchema } from "@/lib/validations/tenant";
import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { LeaseStatus } from "@/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResponse } from "./property-actions";

class ActiveLeaseExistsError extends Error {}

export async function createTenantAndLease(
  values: TenantFormValues,
  propertyId: string,
): Promise<ActionResponse> {
  const user = await requireUser();
  const validatedFields = tenantSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Neplatné údaje vo formulári" };
  }

  const data = validatedFields.data;
  const email = data.email.trim().toLowerCase();

  const property = await prisma.property.findUnique({
    where: { id: propertyId, ownerId: user.id },
  });

  if (!property) {
    return {
      success: false,
      error: "Nemáte oprávnenie pridať nájomcu tejto nehnuteľnosti",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // one flat = one active lease (DB partial unique index is the final guard)
      const activeLease = await tx.lease.findFirst({
        where: { propertyId, status: LeaseStatus.ACTIVE },
        select: { id: true },
      });
      if (activeLease) throw new ActiveLeaseExistsError();

      // reuse the tenant if this owner already has one with the same email
      const tenant = await tx.tenant.upsert({
        where: { ownerId_email: { ownerId: user.id, email } },
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
        },
        create: {
          ownerId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email,
          phone: data.phone || null,
        },
      });

      await tx.lease.create({
        data: {
          propertyId,
          tenantId: tenant.id,
          startDate: data.startDate,
          endDate: data.endDate,
          rentAmount: data.rentAmount,
          depositAmount: data.depositAmount,
          status: LeaseStatus.ACTIVE,
        },
      });
    });
  } catch (error) {
    const isDuplicateActive =
      error instanceof ActiveLeaseExistsError ||
      (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002");

    if (isDuplicateActive) {
      return {
        success: false,
        error: "Táto nehnuteľnosť už má aktívneho nájomcu.",
      };
    }
    console.error("Chyba pri ukladaní nájomcu", error);
    return { success: false, error: "Nastala chyba, skúste to neskôr prosím" };
  }

  revalidatePath(`/properties/${property.id}`);
  redirect(`/properties/${property.id}`);
}

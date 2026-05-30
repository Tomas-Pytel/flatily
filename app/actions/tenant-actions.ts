"use server";

import { requireUser } from "@/lib/auth";
import { TenantFormValues, tenantSchema } from "@/lib/validations/tenant";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResponse } from "./property-actions";

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

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
      ownerId: user.id,
    },
  });

  if (!property) {
    return {
      success: false,
      error: "Nemáte oprávnenie pridať nájomcu tejto nehnuteľnosti",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
      });

      await tx.lease.create({
        data: {
          propertyId: propertyId,
          tenantId: tenant.id,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          rentAmount: data.rentAmount,
          depositAmount: data.depositAmount,
          isActive: true,
        },
      });
    });
  } catch (error) {
    console.log("Chyba pri ukladani najomcu", error);
    return { success: false, error: "Nastala chyba, skuste to neskor prosim" };
  }

  revalidatePath(`/properties/${property.id}`);
  redirect(`/properties/${property.id}`);
}

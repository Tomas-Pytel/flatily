"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { newPropertySchema } from "@/schemas/property";
import type { ActionResult } from "@/types/action-result";
import type { PropertyDetail } from "@/types/property";

export async function deleteProperty(
  propertyId: string,
): Promise<ActionResult<null>> {
  const user = await requireUser();

  let deletedCount: number;

  try {
    const result = await prisma.property.deleteMany({
      where: {
        id: propertyId,
        ownerId: user.id,
      },
    });
    deletedCount = result.count;
  } catch (error) {
    return {
      success: false,
      error: "Nehnuteľnosť sa nepodarilo zmazať. Skúste to znova.",
    };
  }

  if (deletedCount !== 1) {
    return {
      success: false,
      error: "Nehnuteľnosť nebola nájdená alebo k nej nemáte prístup.",
    };
  }

  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true, data: null };
}

export async function createNewProperty(
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsedData = newPropertySchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      error: "Skontrolujte zadané údaje a skúste to znova.",
    };
  }

  let propertyId: string;

  try {
    const property = await prisma.property.create({
      data: {
        ...parsedData.data,
        description: parsedData.data.description?.trim() || null,
        district: parsedData.data.district?.trim() || null,
        ownerId: user.id,
      },
      select: { id: true },
    });
    propertyId = property.id;
  } catch (error) {
    return {
      success: false,
      error: "Nehnuteľnosť sa nepodarilo uložiť. Skúste to znova.",
    };
  }

  revalidatePath("/properties");
  revalidatePath("/dashboard");

  return { success: true, data: { id: propertyId } };
}

export async function getProperty(
  propertyId: string,
): Promise<ActionResult<PropertyDetail>> {
  const user = await requireUser();
  const existingProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
      ownerId: user.id,
    },
    include: {
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
      },
    },
  });

  if (!existingProperty)
    return {
      success: false,
      error: "Nehnuteľnosť neexistuje alebo k nej nemáte prístup.",
    };

  return {
    success: true,
    data: {
      ...existingProperty,
      monthlyRent: Number(existingProperty.monthlyRent),
      utilitiesAmount: Number(existingProperty.utilitiesAmount),
      depositAmount: Number(existingProperty.depositAmount),
      area: Number(existingProperty.area),
      photoUrl: existingProperty.images[1]?.url,
      status: existingProperty.leases[1] ? "Obsadený" : "Voľný",
    },
  };
}

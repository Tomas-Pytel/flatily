"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PropertySchema, type PropertyFormInput } from "@/schemas/property";
import type { ActionResult } from "@/types/action-result";
import type { PropertyDetail } from "@/types/property";

/** Deletes property by id */
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
  } catch {
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

/** Creates new property from form data */
export async function createNewProperty(
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsedData = PropertySchema.safeParse(formData);

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
  } catch {
    return {
      success: false,
      error: "Nehnuteľnosť sa nepodarilo uložiť. Skúste to znova.",
    };
  }

  revalidatePath("/properties");
  revalidatePath("/dashboard");

  return { success: true, data: { id: propertyId } };
}

/** Updates whole property object with form data */
export async function updateProperty(
  propertyId: string,
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  if (!z.uuid().safeParse(propertyId).success) {
    return {
      success: false,
      error: "Nehnuteľnosť neexistuje alebo k nej nemáte prístup.",
    };
  }

  const parsedData = PropertySchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      error: "Skontrolujte zadané údaje a skúste to znova.",
    };
  }

  let updatedCount: number;

  try {
    const result = await prisma.property.updateMany({
      where: {
        id: propertyId,
        ownerId: user.id,
      },
      data: {
        ...parsedData.data,
        description: parsedData.data.description?.trim() || null,
        district: parsedData.data.district?.trim() || null,
      },
    });
    updatedCount = result.count;
  } catch {
    return {
      success: false,
      error: "Nehnuteľnosť sa nepodarilo aktualizovať. Skúste to znova.",
    };
  }

  if (updatedCount !== 1) {
    return {
      success: false,
      error: "Nehnuteľnosť nebola nájdená alebo k nej nemáte prístup.",
    };
  }

  revalidatePath("/properties");
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath(`/properties/${propertyId}/update`);
  revalidatePath("/dashboard");

  return { success: true, data: { id: propertyId } };
}

/** Gets whole property object */
export async function getPropertyDetail(
  propertyId: string,
): Promise<ActionResult<PropertyFormInput>> {
  const user = await requireUser();

  if (!z.uuid().safeParse(propertyId).success) {
    return {
      success: false,
      error: "Nehnuteľnosť neexistuje alebo k nej nemáte prístup.",
    };
  }

  const existingProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
      ownerId: user.id,
    },
  });

  if (!existingProperty)
    return {
      success: false,
      error: "Nehnuteľnosť neexistuje alebo k nej nemáte prístup.",
    };

  const property: PropertyFormInput = {
    title: existingProperty.title,
    street: existingProperty.street,
    city: existingProperty.city,
    postalCode: existingProperty.postalCode,
    monthlyRent: Number(existingProperty.monthlyRent),
    area: Number(existingProperty.area),
    description: existingProperty.description,
    district: existingProperty.district,
    utilitiesAmount: Number(existingProperty.utilitiesAmount),
    depositAmount: Number(existingProperty.depositAmount),
    rooms: Number(existingProperty.rooms),
    floor: Number(existingProperty.floor),
    totalFloors: Number(existingProperty.totalFloors),
    hasBalcony: existingProperty.hasBalcony,
    hasCellar: existingProperty.hasCellar,
    hasElevator: existingProperty.hasElevator,
  };

  return { success: true, data: property };
}

/** Gets property with extended information */
export async function getProperty(
  propertyId: string,
): Promise<ActionResult<PropertyDetail>> {
  const user = await requireUser();

  if (!z.uuid().safeParse(propertyId).success) {
    return {
      success: false,
      error: "Nehnuteľnosť neexistuje alebo k nej nemáte prístup.",
    };
  }

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
        select: { id: true },
      },
    },
  });

  if (!existingProperty)
    return {
      success: false,
      error: "Nehnuteľnosť neexistuje alebo k nej nemáte prístup.",
    };

  const { images, leases, ...property } = existingProperty;

  return {
    success: true,
    data: {
      ...property,
      monthlyRent: Number(property.monthlyRent),
      utilitiesAmount: Number(property.utilitiesAmount),
      depositAmount: Number(property.depositAmount),
      area: Number(property.area),
      photoUrl: images[0]?.url ?? null,
      status: leases[0] ? "Obsadený" : "Voľný",
    },
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { newPropertySchema } from "@/schemas/property";
import type { ActionResult } from "@/types/action-result";

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

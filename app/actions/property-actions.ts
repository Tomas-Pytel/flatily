"use server";

import { PropertyFormValues, propertySchema } from "@/lib/validations/property";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export type ActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/** Creates a new property */
export async function createProperty(
  values: PropertyFormValues,
): Promise<ActionResponse> {
  const user = await requireUser();

  if (!user) {
    return {
      success: false,
      error: "Musíte byť prihlásený pre pridanie nehnuuteľnosti.",
    };
  }

  // data validation
  const validateFields = propertySchema.safeParse(values);

  if (!validateFields.success) {
    return { success: false, error: "Neplatné údaje vo formulári." };
  }

  try {
    await prisma.property.create({
      data: {
        title: validateFields.data.title,
        city: validateFields.data.city,
        street: validateFields.data.street,
        postalCode: validateFields.data.postalCode,
        monthlyRent: validateFields.data.monthlyRent,
        description: validateFields.data.description,
        ownerId: user.id,
        status: "ACTIVE",
      },
    });
  } catch (error) {
    console.error("Chyba pri ukladaní:", error);
    return { success: false, error: "Nastala chyba, skuste to neskor prosim." };
  }

  revalidatePath("/properties");
  redirect("/properties");
}

/** Deletes a property */
export async function deleteProperty(
  propertyId: string,
): Promise<ActionResponse> {
  const user = await requireUser();

  try {
    await prisma.property.delete({
      where: {
        id: propertyId,
        ownerId: user.id,
      },
    });

    revalidatePath("/properties");
    return { success: true };
  } catch (error) {
    console.error("Chyba pri mazaní:", error);
    return { success: false, error: "Nastala chyba, skuste to neskor prosim." };
  }
}

/** Uploads image to supabase storage */
export async function addPropertyImage(
  propertyId: string,
  imageUrl: string,
): Promise<ActionResponse> {
  const user = await requireUser();

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
      ownerId: user.id,
    },
  });

  if (!property)
    return {
      success: false,
      error: "Nemáte oprávnení přidat obrázek této nemovitosti.",
    };

  try {
    await prisma.propertyImage.create({
      data: {
        url: imageUrl,
        propertyId: propertyId,
      },
    });

    if (!property.imageUrl) {
      await prisma.property.update({
        where: { id: propertyId },
        data: { imageUrl: imageUrl },
      });
    }

    revalidatePath(`/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Chyba pri ukladaní obrázka:", error);
    return {
      success: false,
      error: "Nastala chyba, neporadilo sa uložiť obrázok.",
    };
  }
}

/** Sets specified image as the one to be shown in the properties list */
export async function setPrimaryImage(
  propertyId: string,
  imageUrl: string,
): Promise<ActionResponse> {
  const user = await requireUser();

  try {
    await prisma.property.update({
      where: { id: propertyId, ownerId: user.id },
      data: { imageUrl: imageUrl },
    });

    revalidatePath(`/properties/${propertyId}`);
    revalidatePath("/properties");
    return { success: true };
  } catch (error) {
    console.error("Chyba pri nastavovaní hlavného obrázka:", error);
    return {
      success: false,
      error: "Nastala chyba, neporadilo sa nastaviť hlavný obrázok.",
    };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import {
  MaintenanceFormValues,
  maintenanceSchema,
  PropertyFormValues,
  propertySchema,
} from "@/lib/validations/property";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function createProperty(values: PropertyFormValues) {
  // get user
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const user = data?.user;

  if (!user) {
    return { error: "Musíte byť prihlásený pre pridanie nehnuuteľnosti." };
  }

  // data validation
  const validateFields = propertySchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Neplatné údaje vo formulári." };
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
    return { error: "Nastala chyba, skuste to neskor prosim." };
  }

  revalidatePath("/properties");
  redirect("/properties");
}

export async function createMaintenance(
  values: MaintenanceFormValues,
  propertyId: string,
) {
  const user = await requireUser();
  const validatedFields = maintenanceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Neplatné údaje vo formulári" };
  }

  const data = validatedFields.data;

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
      ownerId: user.id,
    },
  });

  if (!property) {
    return { error: "Nemáte oprávnenie pridať opravu tejto nehnuteľnosti" };
  }

  try {
    await prisma.maintenance.create({
      data: {
        title: data.title,
        cost: data.cost,
        status: data.status,
        description: data.description,
        provider: data.provider,
        resolvedDate: data.resolvedDate,
        propertyId: propertyId,
      },
    });

    revalidatePath(`/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Chyba pri ukladaní:", error);
    return { error: "Nastala chyba, skuste to neskor prosim." };
  }
}

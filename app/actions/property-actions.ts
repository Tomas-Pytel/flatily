"use server";

import { createClient } from "@/lib/supabase/server";
import { PropertyFormValues, propertySchema } from "@/lib/validations/property";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

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
    return { error: "Nastala chyba pri ukladaní do databázy." };
  }

  revalidatePath("/properties");
  redirect("/properties");
}

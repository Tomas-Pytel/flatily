"use server";

import { requireUser } from "@/lib/auth";
import { tenantSchema } from "@/schemas/tenant";
import { ActionResult } from "@/types/action-result";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createNewTenant(
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsedData = tenantSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      error: "Skontrolujte zadané údaje a skúste to znova.",
    };
  }

  let tenantId: string;

  try {
    const tenant = await prisma.tenant.create({
      data: {
        ...parsedData.data,
        ownerId: user.id,
      },
      select: { id: true },
    });
    tenantId = tenant.id;
  } catch {
    return {
      success: false,
      error: "Nájomníka sa nepodarilo uložiť. Skúste to znova.",
    };
  }

  revalidatePath("/tenants");
  revalidatePath("/dashboard");

  return { success: true, data: { id: tenantId } };
}

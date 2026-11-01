"use server";

import { requireUser } from "@/lib/auth";
import { tenantSchema } from "@/schemas/tenant";
import { ActionResult } from "@/types/action-result";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { TenantFormInput } from "@/schemas/tenant";

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
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
        email: parsedData.data.email,
        phone: parsedData.data.phone?.trim() || null,
        idCardNumber: parsedData.data.idCardNumber?.trim() || null,
        notes: parsedData.data.notes?.trim() || null,
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

export async function updateTenant(
  tenantId: string,
  formData: unknown,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  if (!z.uuid().safeParse(tenantId).success) {
    return {
      success: false,
      error: "Nájomník neexistuje alebo k nemu nemáte prístup.",
    };
  }

  const parsedData = tenantSchema.safeParse(formData);
  if (!parsedData.success) {
    return {
      success: false,
      error: "Skontrolujte zadané údaje a skúste to znova.",
    };
  }

  let updatedCount: number;
  try {
    const result = await prisma.tenant.updateMany({
      where: { id: tenantId, ownerId: user.id },
      data: {
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
        email: parsedData.data.email,
        phone: parsedData.data.phone,
        idCardNumber: parsedData.data.idCardNumber?.trim() || null,
        notes: parsedData.data.notes?.trim() || null,
      },
    });
    updatedCount = result.count;
  } catch {
    return {
      success: false,
      error: "Nájomníka sa nepodarilo aktualizovať. Skúste to znova.",
    };
  }

  if (updatedCount !== 1) {
    return {
      success: false,
      error: "Nájomník nebol nájdený alebo k nemu nemáte prístup.",
    };
  }

  revalidatePath("/tenants");
  revalidatePath(`/tenants/${tenantId}/update`);
  revalidatePath("/dashboard");

  return { success: true, data: { id: tenantId } };
}

export async function getTenantDetail(
  tenantId: string,
): Promise<ActionResult<TenantFormInput>> {
  const user = await requireUser();

  if (!z.uuid().safeParse(tenantId).success) {
    return {
      success: false,
      error: "Nájomník neexistuje alebo k nemu nemáte prístup.",
    };
  }

  const tenant = await prisma.tenant.findFirst({
    where: { id: tenantId, ownerId: user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      idCardNumber: true,
      notes: true,
    },
  });

  if (!tenant) {
    return {
      success: false,
      error: "Nájomník neexistuje alebo k nemu nemáte prístup.",
    };
  }

  return { success: true, data: tenant };
}

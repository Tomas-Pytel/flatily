"use server";

import { MaintenanceStatus } from "@/lib/generated/prisma/enums";
import {
  MaintenanceFormValues,
  maintenanceSchema,
} from "@/lib/validations/property";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "./property-actions";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/** Creates a new maintenance record */
export async function createMaintenance(
  values: MaintenanceFormValues,
  propertyId: string,
): Promise<ActionResponse> {
  const user = await requireUser();
  const validatedFields = maintenanceSchema.safeParse(values);

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
      error: "Nemáte oprávnenie pridať opravu tejto nehnuteľnosti",
    };
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
    return { success: false, error: "Nastala chyba, skuste to neskor prosim." };
  }
}

/** Marks maintenance as resolved */
export async function resolveMaintenance(
  maintenanceId: string,
  // pathname?: string,
): Promise<ActionResponse> {
  const user = await requireUser();

  const maintenance = await prisma.maintenance.findUnique({
    where: {
      id: maintenanceId,
    },
    include: {
      property: true,
    },
  });

  if (!maintenance) {
    return { success: false, error: "Vybraná položka neexistuje" };
  }

  if (maintenance.property.ownerId !== user.id) {
    return {
      success: false,
      error: "Nemáte oprávnenie upravovať túto opravu",
    };
  }

  try {
    await prisma.maintenance.update({
      where: {
        id: maintenanceId,
      },
      data: {
        status: MaintenanceStatus.RESOLVED,
        resolvedDate: new Date(),
      },
    });

    // if (pathname) {
    //   revalidatePath(pathname);
    // }

    return { success: true };
  } catch (error) {
    console.log("Chyba pri oznacovani opravy, ", error);
    return { success: false, error: "Nepodarilo sa upraviť status opravy" };
  }
}

/** Deletes maintenance record */
export async function deleteMaintenance(
  maintenanceId: string,
): Promise<ActionResponse> {
  const user = await requireUser();

  const maintenance = await prisma.maintenance.findUnique({
    where: { id: maintenanceId },
    include: {
      property: { select: { id: true, ownerId: true } },
    },
  });

  if (!maintenance)
    return {
      success: false,
      error: "Nepodarilo sa nájsť daný záznam o oprave.",
    };

  if (maintenance.property.ownerId !== user.id)
    return {
      success: false,
      error: "Na odstránenie daného záznamu nemáte oprávnenie.",
    };

  try {
    prisma.maintenance.delete({
      where: { id: maintenanceId },
    });

    revalidatePath(`/properties/${maintenance.property.id}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Nepodarilo sa vymazať záznam o oprave, skúste to neskôr prosím.",
    };
  }
}

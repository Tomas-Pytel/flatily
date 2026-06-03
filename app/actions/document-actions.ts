"use server";

import { requireUser } from "@/lib/auth";
import { ActionResponse } from "./property-actions";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface DocumentFormValues {
  title: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export async function addPropertyDocument(
  propertyId: string,
  data: DocumentFormValues,
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
      error: "Nemáte oprávnenie pridať dokument k tejto nehnuteľnosti.",
    };

  try {
    await prisma.document.create({
      data: {
        title: data.title,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
        propertyId: propertyId,
      },
    });

    revalidatePath(`/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Chyba pri ukladaní dokumentu:", error);
    return { success: false, error: "Nastala chyba, skúste to neskôr prosím." };
  }
}

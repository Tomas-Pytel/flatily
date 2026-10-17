"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function deleteProperty(propertyId: string) {
  const user = await requireUser();

  const result = await prisma.property.deleteMany({
    where: {
      id: propertyId,
      ownerId: user.id,
    },
  });

  if (result.count !== 1) {
    throw new Error("Nehnuteľnosť nebola nájdená alebo k nej nemáte prístup.");
  }

  revalidatePath("/properties");
}

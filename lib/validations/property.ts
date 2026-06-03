import * as z from "zod";
import { MaintenanceStatus } from "../generated/prisma/enums";

export const propertySchema = z.object({
  title: z.string().min(3, "Názov musí mať aspoň 3 znaky").max(100),
  city: z.string().min(2, "Mesto je povinné"),
  street: z.string().min(2, "Ulica je povinná"),
  postalCode: z.string().length(5, "PSČ musí mať 5 znakov"),
  monthlyRent: z.number().min(1, "Nájom musí byť viac ako 0"),
  description: z.string().max(150).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const maintenanceSchema = z
  .object({
    title: z
      .string()
      .min(3, "Názov musí mať aspoň 3 znaky")
      .max(100, "Názov musí byť kratší ako 100 znakov"),
    cost: z.number().min(1, "Cena opravy musí byť väčšia ako 1"),
    status: z.enum(MaintenanceStatus),
    provider: z.string().optional(),
    description: z.string().optional(),
    resolvedDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.status === MaintenanceStatus.RESOLVED) {
        return !!data.resolvedDate;
      }
      return true;
    },
    {
      message: "Pri vyriešenej oprave musíte zadať dátum ukončenia",
      path: ["resolvedDate"],
    },
  );

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

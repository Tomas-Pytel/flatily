import * as z from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Názov musí mať aspoň 3 znaky").max(100),
  city: z.string().min(2, "Mesto je povinné"),
  street: z.string().min(2, "Ulica je povinná"),
  postalCode: z.string().length(5, "PSČ musí mať 5 znakov"),
  monthlyRent: z.number().min(1, "Nájom musí byť viac ako 0"),
  description: z.string().max(150).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const maintenanceSchema = z.object({});

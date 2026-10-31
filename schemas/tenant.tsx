import z from "zod";

export const tenantSchema = z.object({
  firstName: z.string().trim().min(1, "Meno je povinné"),
  lastName: z.string().trim().min(1, "Priezvisko je povinné"),
  email: z.string().trim().email("Zadajte platnú emailovú adresu"),
  phone: z.string().trim().min(1, "Telefón je povinný"),
  idCardNumber: z.string().trim(),
  notes: z.string().trim(),
});

export type TenantFormInput = z.input<typeof tenantSchema>;
export type TenantFormOutput = z.output<typeof tenantSchema>;

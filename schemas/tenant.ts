import z from "zod";

export const tenantSchema = z.object({
  firstName: z.string().trim().min(1, "Meno je povinné"),
  lastName: z.string().trim().min(1, "Priezvisko je povinné"),
  email: z.string().trim().email("Zadajte platnú emailovú adresu"),
  phone: z
    .string()
    .trim()
    .nullish()
    .transform((phone) => phone || null)
    .refine((phone) => {
      if (phone === null) return true;

      const digitCount = phone.replace(/\D/g, "").length;
      return (
        /^\+?[0-9](?:[0-9\s().-]*[0-9])?$/.test(phone) &&
        digitCount >= 7 &&
        digitCount <= 15
      );
    }, "Zadajte platné telefónne číslo"),
  idCardNumber: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});

export type TenantFormInput = z.input<typeof tenantSchema>;
export type TenantFormOutput = z.output<typeof tenantSchema>;

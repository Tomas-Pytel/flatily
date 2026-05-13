import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const tenantSchema = z.object({
  firstName: z
    .string()
    .min(2, "Meno musí mať aspoň 2 znaky")
    .max(20, "Meno nesmie presiahnuť 20 znakov"),
  lastName: z
    .string()
    .min(2, "Priezvisko musí mať aspoň 2 znaky")
    .max(20, "Priezvisko nesmie presiahnuť 20 znakov"),
  email: z.email(),
  phone: z.string().refine((val) => isValidPhoneNumber(val), {
    message: "Neplatné telefónne číslo",
  }),
  imageUrl: z.string().optional(),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;

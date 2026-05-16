import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const tenantSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Meno musí mať aspoň 2 znaky")
      .max(20, "Meno nesmie presiahnuť 20 znakov"),
    lastName: z
      .string()
      .min(2, "Priezvisko musí mať aspoň 2 znaky")
      .max(20, "Priezvisko nesmie presiahnuť 20 znakov"),
    email: z.email("Neplatný email"),
    phone: z.string().refine((val) => isValidPhoneNumber(val), {
      message: "Neplatné telefónne číslo",
    }),
    imageUrl: z.string().optional(),

    // udaje o zmluve
    startDate: z.date(),
    endDate: z.date(),
    rentAmount: z.number().min(1, "Nájom musí byť viac ako 1"),
    depositAmount: z.number().min(0, "Záloha nemôže byť záporná"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Dátum ukončenia musí byť neskôr ako dátum začiatku",
    path: ["endDate"],
  });

export type TenantFormValues = z.infer<typeof tenantSchema>;

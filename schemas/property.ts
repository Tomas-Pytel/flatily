import { z } from "zod";

export const PropertySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Názov nehnuteľnosti je povinný")
      .max(100, "Názov môže mať najviac 100 znakov"),
    description: z
      .string()
      .trim()
      .max(1000, "Popis môže mať najviac 1000 znakov")
      .nullable()
      .optional(),

    street: z
      .string()
      .trim()
      .min(1, "Ulica je povinná")
      .max(100, "Ulica môže mať najviac 100 znakov"),
    city: z
      .string()
      .trim()
      .min(1, "Mesto je povinné")
      .max(60, "Mesto môže mať najviac 60 znakov"),
    district: z
      .string()
      .trim()
      .max(60, "Mestská časť môže mať najviac 60 znakov")
      .nullable()
      .optional(),
    postalCode: z
      .string()
      .trim()
      .regex(/^\d{5}$/, "PSČ musí mať 5 číslic"),

    monthlyRent: z.coerce
      .number({ message: "Nájomné musí byť číslo" })
      .nonnegative("Nájomné nemôže byť záporné")
      .multipleOf(0.01, "Nájomné môže mať najviac 2 desatinné miesta")
      .max(9_999_999_999.99, "Nájomné je príliš vysoké"),

    utilitiesAmount: z.coerce
      .number({ message: "Výška energií musí byť číslo" })
      .nonnegative("Výška energií nemôže byť záporná")
      .multipleOf(0.01, "Výška energií môže mať najviac 2 desatinné miesta")
      .max(9_999_999_999.99, "Výška energií je príliš vysoká")
      .default(0),

    depositAmount: z.coerce
      .number({ message: "Výška depozitu musí byť číslo" })
      .nonnegative("Výška depozitu nemôže byť záporná")
      .multipleOf(0.01, "Výška depozitu môže mať najviac 2 desatinné miesta")
      .max(9_999_999_999.99, "Výška depozitu je príliš vysoká")
      .default(0),

    rooms: z.coerce
      .number({ message: "Počet izieb musí byť číslo" })
      .int("Počet izieb musí byť celé číslo")
      .positive("Počet izieb musí byť väčší ako 0")
      .max(50, "Počet izieb môže byť najviac 50")
      .default(1),

    area: z.coerce
      .number({ message: "Rozloha musí byť číslo" })
      .positive("Rozloha musí byť väčšia ako 0")
      .multipleOf(0.01, "Rozloha môže mať najviac 2 desatinné miesta")
      .max(99_999.99, "Rozloha je príliš veľká"),

    floor: z.coerce
      .number({ message: "Poschodie musí byť číslo" })
      .int("Poschodie musí byť celé číslo")
      .nonnegative("Poschodie nemôže byť záporné")
      .max(200, "Poschodie môže byť najviac 200")
      .default(0),

    totalFloors: z.coerce
      .number({ message: "Počet poschodí musí byť číslo" })
      .int("Počet poschodí musí byť celé číslo")
      .positive("Počet poschodí musí byť väčší ako 0")
      .max(200, "Počet poschodí môže byť najviac 200")
      .default(1),

    hasElevator: z.boolean().default(false),
    hasBalcony: z.boolean().default(false),
    hasCellar: z.boolean().default(false),
  })
  .refine((data) => data.floor <= data.totalFloors, {
    message: "Poschodie nemôže byť vyššie ako počet poschodí",
    path: ["floor"],
  });

export type PropertyFormInput = z.input<typeof PropertySchema>;
export type PropertyFormOutput = z.output<typeof PropertySchema>;

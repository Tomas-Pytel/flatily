import { z } from "zod";

export const newPropertySchema = z.object({
  title: z.string().min(1, "Názov nehnuteľnosti je povinný"),
  description: z.string().nullable().optional(),

  street: z.string().min(1, "Ulica je povinná"),
  city: z.string().min(1, "Mesto je povinné"),
  district: z.string().nullable().optional(),
  postalCode: z.string().length(5, "PSČ je povinné"),

  monthlyRent: z.coerce
    .number({ message: "Nájomné musí byť číslo" })
    .nonnegative("Nájomné nemôže byť záporné"),

  utilitiesAmount: z.coerce
    .number({ message: "Výška energií musí byť číslo" })
    .nonnegative("Výška energií nemôže byť záporná")
    .default(0),

  depositAmount: z.coerce
    .number({ message: "Výška depozitu musí byť číslo" })
    .nonnegative("Výška depozitu nemôže byť záporná")
    .default(0),

  rooms: z.coerce
    .number({ message: "Počet izieb musí byť číslo" })
    .int("Počet izieb musí byť celé číslo")
    .positive("Počet izieb musí byť väčší ako 0")
    .default(1),

  area: z.coerce
    .number({ message: "Rozloha musí byť číslo" })
    .positive("Rozloha musí byť väčšia ako 0"),

  floor: z.coerce
    .number({ message: "Poschodie musí byť číslo" })
    .int("Poschodie musí byť celé číslo")
    .nonnegative("Poschodie nemôže byť záporné")
    .default(0),

  totalFloors: z.coerce
    .number({ message: "Počet poschodí musí byť číslo" })
    .int("Počet poschodí musí byť celé číslo")
    .positive("Počet poschodí musí byť väčší ako 0")
    .default(1),

  hasElevator: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  hasCellar: z.boolean().default(false),
});

export type NewPropertyFormInput = z.input<typeof newPropertySchema>;
export type NewPropertyFormOutput = z.output<typeof newPropertySchema>;

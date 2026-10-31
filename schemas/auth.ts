import { z } from "zod";

export const emailSchema = z.email("Zadajte platný e-mail");

export const passwordSchema = z
  .string()
  .min(8, "Heslo musí mať aspoň 8 znakov")
  .regex(/[a-z]/, "Heslo musí obsahovať malé písmeno")
  .regex(/[A-Z]/, "Heslo musí obsahovať veľké písmeno")
  .regex(/[0-9]/, "Heslo musí obsahovať číslicu")
  .regex(/[^A-Za-z0-9]/, "Heslo musí obsahovať špeciálny znak");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Heslo je povinné"),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    repeatPassword: z.string().min(1, "Zopakujte heslo"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Heslá sa nezhodujú",
    path: ["repeatPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    repeatPassword: z.string().min(1, "Zopakujte heslo"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Heslá sa nezhodujú",
    path: ["repeatPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

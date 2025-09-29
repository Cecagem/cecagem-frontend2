import * as z from "zod";

export const loginSchema = z.object({
  email: z.email(
    "Por favor ingresa una dirección de correo electrónsico válida"
  ),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(2, "La contraseña debe tener al menos 2 caracteres"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email(
    "Por favor ingresa una dirección de correo electrónico válida"
  ),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

import z from "zod";

export const SendEmailResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Se debe ingresar un email.")
    .max(50, "El email es muy largo.")
    .email("Email invalido.")
    .toLowerCase()
    .trim(),
});

export type SendEmailResetRequest = z.infer<typeof SendEmailResetRequestSchema>;

export const SendEmailResetResponseSchema = z.object({
    message: z.string().optional(),
    error: z.string().optional(),
})

export type SendEmailResetResponse = z.infer<typeof SendEmailResetResponseSchema>;

export const VerifyCodeRequestSchema = z.object({
  code: z.string().min(6, "El código de verificación debe tener 6 caracteres").max(6, "El código de verificación debe tener 6 caracteres"),
});

export type VerifyCodeRequest = z.infer<typeof VerifyCodeRequestSchema>;

export const VerifyCodeResponseSchema = z.object({
    message: z.string().optional(),
    error: z.string().optional(),
})

export type VerifyCodeResponse = z.infer<typeof VerifyCodeResponseSchema>;

export const PasswordResetRequestSchema = z.object({
  code: z.string().min(1, "Se debe ingresar un código.").max(50, "El código es muy largo.").trim(),
  password: z.string().min(8, "Se debe ingresar una contraseña.").max(50, "La contraseña es muy larga.").trim(),
  confirmPassword: z.string().min(8, "Se debe ingresar una contraseña.").max(50, "La contraseña es muy larga.").trim(),
});

export type PasswordResetRequest = Omit<z.infer<typeof PasswordResetRequestSchema>, 'confirmPassword'>;

export const PasswordResetResponseSchema = z.object({
    message: z.string().optional(),
    error: z.string().optional(),
})

export type PasswordResetResponse = z.infer<typeof PasswordResetResponseSchema>;
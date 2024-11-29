import z from "zod";

export const infoSchema = z.object({
  email: z
    .string()
    .min(1, "Se debe ingresar un email.")
    .max(50, "El email es muy largo.")
    .email("Email invalido.")
    .toLowerCase(),
  firstName: z.string({message: "Ingresa un nombre"}).min(1, "Se debe ingresar un nombre."),
  lastName: z.string({message: "Ingresa un apellido"}).min(1, "Se debe ingresar un apellido."),
});

export type InfoSchema = z.infer<typeof infoSchema>;

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña es muy corta.")
      .max(50, "La contraseña es muy larga."),
    // })
    confirmPassword: z
      .string()
      .min(1, "Ingresa la contraseña de nuevo.")
      .max(50, "La contraseña es muy larga."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type PasswordSchema = z.infer<typeof passwordSchema>;

export const fullSchema = z.object({
  info: infoSchema,
  password: passwordSchema,
});

export type FullSchema = z.infer<typeof fullSchema>;

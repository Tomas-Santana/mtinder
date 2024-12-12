import z from "zod";

export const infoSchema = z.object({
  email: z
    .string()
    .min(1, "You must enter an email.")
    .max(100, "Email is too long.")
    .email("Invalid Email.")
    .toLowerCase(),
  firstName: z
    .string({ message: "Enter your name." })
    .min(1, "Enter your name.")
    .max(50, "Name is too long."),
  lastName: z
    .string({ message: "Enter your last name." })
    .min(1, "Enter your last name.")
    .max(50, "Last name is too long."),
});

export type InfoSchema = z.infer<typeof infoSchema>;

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password is too short.")
      .max(50, "Password is too long."),
    confirmPassword: z
      .string()
      .min(1, "Enter the password again.")
      .max(50, "Password is too long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type PasswordSchema = z.infer<typeof passwordSchema>;

export const fullSchema = z.object({
  info: infoSchema,
  password: passwordSchema,
});

export type FullSchema = z.infer<typeof fullSchema>;

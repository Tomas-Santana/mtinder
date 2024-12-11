import z from "zod";
import { userSchema } from "../User";
export const meResponse = z.object({
  me: userSchema,
  error: z.string().optional(),
});

export type MeResponse = z.infer<typeof meResponse>;

import z from "zod";
import { UserSchema } from "../User";
export const meResponse = z.object({
  me: UserSchema,
  error: z.string().optional()
});

export type MeResponse = z.infer<typeof meResponse>;

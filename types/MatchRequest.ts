import z from "zod";

export const matchRequestSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export type MatchRequest = z.infer<typeof matchRequestSchema>;
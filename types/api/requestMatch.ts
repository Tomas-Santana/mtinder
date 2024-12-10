import z from "zod";

export const requestMatchSchema = z.object({
  userId: z.string(),
});

export const requestMatchResponseSchema = z.object({
  status: z.enum(["created", "accepted"]),
  chatId: z.string().optional(),
});

export type RequestMatch = z.infer<typeof requestMatchSchema>;
export type RequestMatchResponse = z.infer<typeof requestMatchResponseSchema>;

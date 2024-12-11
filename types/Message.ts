import z from "zod"

export const messageSchema = z.object({
  _id: z.string(),
  content: z.string(),
  contentType: z.enum(["text", "image"]),
  timestamp: z.date({coerce: true}),
  chatId: z.string(),
  userId: z.string(),
})

export type Message = z.infer<typeof messageSchema>
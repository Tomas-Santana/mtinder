import z from "zod"

export const chatSchema = z.object({
  _id: z.string(),
  roomId: z.string(),
  participants: z.array(z.string()),
  messages: z.array(z.string()),
  lastMessage: z.object({
    message: z.string(),
    timestamp: z.date({coerce: true}),
    senderName: z.string(),
  }).nullish(),
})

export type Chat = z.infer<typeof chatSchema>
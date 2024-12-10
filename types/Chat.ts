import z from "zod"

export const chatSchema = z.object({
  _id: z.string(),
  participants: z.array(z.string()),
  participantsInfo: z.array(z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    profilePicture: z.string().nullish(),
  })),
  messages: z.array(z.string()),
  lastMessage: z.object({
    message: z.string(),
    timestamp: z.date({coerce: true}),
    senderName: z.string(),
  }).nullish(),
})

export type Chat = z.infer<typeof chatSchema>


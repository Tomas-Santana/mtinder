import z from "zod"
import { messageSchema } from "../Message"

export const getMessagesResponse = z.object({
  messages: z.array(messageSchema),
  deleted: z.boolean().nullish(),
})

export type GetMessagesResponse = z.infer<typeof getMessagesResponse>
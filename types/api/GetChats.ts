import z from "zod"
import { chatSchema } from "../Chat"

export const getChatsResponse = z.object({
  chats: z.array(chatSchema).optional(),
})

export type GetChatsResponse = z.infer<typeof getChatsResponse>
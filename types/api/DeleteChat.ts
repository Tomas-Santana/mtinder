import z from "zod"

const DeleteChatRequestSchema = z.object({
  _id: z.string()
})

export const DeleteChatResponseSchema = z.object({
  id: z.string()
})

export type DeleteChatRequest = z.infer<typeof DeleteChatRequestSchema>
export type DeleteChatResponse = z.infer<typeof DeleteChatResponseSchema>
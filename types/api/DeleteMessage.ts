import z from "zod"

export const deleteMessageResponse = z.object({
  error: z.string().nullish(),
  _id: z.string().nullish()
})

export type DeleteMessageResponse = z.infer<typeof deleteMessageResponse>
import z from "zod"
import { matchRequestSchema } from "../MatchRequest"

export const getMatchRequestResponseSchema = z.object({
  requests: z.array(matchRequestSchema),
})

export type GetMatchRequestsResponse = z.infer<typeof getMatchRequestResponseSchema>
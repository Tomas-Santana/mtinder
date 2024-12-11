import z from "zod";
import { userSchema } from "./User";

export const chatSchema = z.object({
  _id: z.string(),
  participants: z.array(userSchema),
  messages: z.array(z.string()),
  lastMessage: z
    .object({
      message: z.string(),
      timestamp: z.date({ coerce: true }),
      senderId: z.string(),
    })
    .nullish(),
});

export const reducedChatSchema = z.object({
  _id: z.string(),
  participants: z.array(z.string()),
  lastMessage: z
    .object({
      message: z.string(),
      timestamp: z.date({ coerce: true }),
      senderId: z.string(),
    })
    .nullish(),
});

export type Chat = z.infer<typeof chatSchema>;
export type ReducedChat = z.infer<typeof reducedChatSchema>;

import z from "zod";
import { messageSchema } from "../Message";

export const sendMessage = z.object({
  contentType: z.enum(["text", "image"]),
  content: z.string(),
});

export type SendMessage = z.infer<typeof sendMessage>;

export const sendMessageResponse = z.object({
  message: messageSchema,
});

export type SendMessageResponse = z.infer<typeof sendMessageResponse>;

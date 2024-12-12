import { getChatsResponse, GetChatsResponse } from "@/types/api/GetChats";
import { GetMessagesResponse, getMessagesResponse } from "@/types/api/GetMessages";
import { superFetch } from "./superfetch/superFetch";
import { DeleteChatRequest, DeleteChatResponse, DeleteChatResponseSchema } from "@/types/api/DeleteChat";
import { SendMessage, sendMessageResponse, sendMessage, SendMessageResponse } from "@/types/api/SendMessage";
import { DeleteMessageResponse, deleteMessageResponse } from "@/types/api/DeleteMessage";

export default class ChatController {
  static async getChats(): Promise<GetChatsResponse> {
    try {
      const res = await superFetch<null, GetChatsResponse, "chat">({
        options: {
          method: "GET",
          includeCredentials: true,
        },
        route: "chat",
        routeParams: [],
        responseSchema: getChatsResponse,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new Error("error fetching chats");
    }
  }

  static async deleteChat(payload: DeleteChatRequest): Promise<DeleteChatResponse> {
    try {
      const response = await superFetch<DeleteChatRequest, DeleteChatResponse, "chat/[id]">({
        options: {
          method: "DELETE",
          includeCredentials: true,
        },
        route: "chat/[id]",
        routeParams: [payload._id],
        responseSchema: DeleteChatResponseSchema,
      })

      return response;
    } catch (error) {
      console.log(error);
      throw new Error("error deleting chat");
    }
  }

  static async getMessages(chatId: string): Promise<GetMessagesResponse> {
    try {
      const res = await superFetch<null, GetMessagesResponse, "chatMessages">({
        options: {
          method: "GET",
          includeCredentials: true,
        },
        route: "chatMessages",
        routeParams: [chatId],
        responseSchema: getMessagesResponse,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new Error("error fetching messages");
    }
  }

  static async sendMessage(chatId: string, payload: SendMessage): Promise<SendMessageResponse> {
    try {
      const res = await superFetch<SendMessage, SendMessageResponse, "chatMessages">({
        options: {
          method: "POST",
          includeCredentials: true,
        },
        route: "chatMessages",
        routeParams: [chatId],
        responseSchema: sendMessageResponse,
        payload,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new Error("error sending message");
    }
  }

  static async deleteMessage(chatId: string, messageId: string): Promise<DeleteMessageResponse> {
    try {
      const res = await superFetch<null, DeleteMessageResponse, "messages/[id]">({
        options: {
          method: "DELETE",
          includeCredentials: true,
        },
        route: "messages/[id]",
        routeParams: [chatId, messageId],
        responseSchema: deleteMessageResponse,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new Error("error deleting message");
    }
  }

}
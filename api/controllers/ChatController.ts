import { getChatsResponse, GetChatsResponse } from "@/types/api/GetChats";
import { superFetch } from "./superfetch/superFetch";
import { DeleteChatRequest, DeleteChatResponse, DeleteChatResponseSchema } from "@/types/api/DeleteChat";

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
}
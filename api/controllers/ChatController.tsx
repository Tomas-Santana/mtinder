import { getChatsResponse, GetChatsResponse } from "@/types/api/GetChats";
import { superFetch } from "./superfetch/superFetch";

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
}
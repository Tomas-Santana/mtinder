import { io } from "socket.io-client";
import { ChatToastContent } from "@/components/app/NewChatToastContent";
import { queryClient } from "@/app/_layout";
import { Toast } from "@/components/ui/toast";
import { GetChatsResponse } from "@/types/api/GetChats";
import { GetMatchRequestsResponse } from "@/types/api/GetMatchRequests";
import { Chat } from "@/types/Chat";
import { MatchRequest } from "@/types/MatchRequest";

const SERVER = process.env.EXPO_PUBLIC_SERVER || "localhost:3000";
console.log(SERVER);

export const socket = io(SERVER, {
  autoConnect: false,
});

export default class SocketController {
  static socket = socket;
  static async connect() {
    socket.connect();
  }

  static async disconnect() {
    socket.disconnect();
  }
  static setToken(token: string) {
    SocketController.socket.auth = { token };
  }
  static handleNewChat(newChat: Chat, noToast?: boolean) {
    const oldChats = queryClient.getQueryData<GetChatsResponse>(["chats"]);
    if (!!oldChats?.chats?.some((chat) => chat._id === newChat._id)) {
      return;
    }
    !noToast && Toast.custom(ChatToastContent({ chat: newChat }));
    queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
      return {
        chats: [...(data?.chats || []), newChat],
      };
    });
  }

  static handleNewMatchRequest(newMatchRequest: MatchRequest) {
    const oldRequests = queryClient.getQueryData<GetMatchRequestsResponse>([
      "matchRequests",
    ]);

    if (
      !!oldRequests?.requests?.some((req) => req.from === newMatchRequest.from)
    ) {
      return;
    }

    queryClient.setQueryData<GetMatchRequestsResponse>(["matchRequests"], (data) => {
      return {
        requests: [...(data?.requests || []), newMatchRequest],
      };
    });
  }

  static async subscribe() {
    socket.on("matchRequest", SocketController.handleNewMatchRequest);
    socket.on("newChat", SocketController.handleNewChat);
  }
}





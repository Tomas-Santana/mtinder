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

socket.on("connection", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("match-request", (data) => {
  console.log("Match request received", data);
});

export function subscribe() {
  console.log("subscribing to socket events");
  const handleNewChat = (newChat: Chat) => {
    const oldChats = queryClient.getQueryData<GetChatsResponse>(["chats"]);
    if (!!oldChats?.chats?.some((chat) => chat._id === newChat._id)) {
      return;
    }

    Toast.custom(ChatToastContent({ chatId: newChat._id }));
    queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
      return {
        chats: [...(data?.chats || []), newChat],
      };
    });
    queryClient.invalidateQueries({ queryKey: ["chats"], exact: true });
  };

  const handleNewMatchRequest = (newMatchRequest: MatchRequest) => {
    const oldRequests = queryClient.getQueryData<GetMatchRequestsResponse>([
      "matchRequests",
    ]);

    if (
      !!oldRequests?.requests?.some((req) => req.from === newMatchRequest.from)
    ) {
      return;
    }

    queryClient.setQueryData<GetMatchRequestsResponse>(
      ["matchRequests"],
      (data) => {
        return {
          requests: [...(data?.requests || []), newMatchRequest],
        };
      }
    );
  };

  socket.on("matchRequest", handleNewMatchRequest);

  socket.on("newChat", handleNewChat);
}

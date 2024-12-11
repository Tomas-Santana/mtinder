import { io } from "socket.io-client";
import { NewChatToastContent, NewMessageToastContent } from "@/components/app/NewChatToastContent";
import { queryClient } from "@/app/_layout";
import { Toast } from "@/components/ui/toast";
import { GetChatsResponse } from "@/types/api/GetChats";
import { GetMatchRequestsResponse } from "@/types/api/GetMatchRequests";
import { Chat } from "@/types/Chat";
import { MatchRequest } from "@/types/MatchRequest";
import { Message } from "@/types/Message";
import { getDefaultStore } from "jotai";
import { currentChatAtom } from "@/utils/atoms/currentChatAtom";
import { userAtom } from "@/utils/atoms/userAtom";

const SERVER = process.env.EXPO_PUBLIC_SERVER || "http://localhost:3000";
console.log(SERVER);

export const socket = io(SERVER, {
  autoConnect: false,
});

const store = getDefaultStore();

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
  static handleNewChat(newChat: Chat, noToast: boolean = false) {
    console.log("i got a new chat");
    const oldChats = queryClient.getQueryData<GetChatsResponse>(["chats"]);
    if (!!oldChats?.chats?.some((chat) => chat._id === newChat._id)) {
      return;
    }
    !noToast && Toast.custom(NewChatToastContent({ chat: newChat }));
    queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
      return {
        chats: [...(data?.chats || []), newChat],
      };
    });
  }

  static handleNewMatchRequest(newMatchRequest: MatchRequest) {
    console.log("i got a new match request");
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
  }

  static handleNewMessage(newMessage: Message) {
    console.log("i got a new message");
    const currentChat = store.get(currentChatAtom);
    const user = store.get(userAtom);
    if (newMessage.chatId === currentChat) {
      return; // handled in useMessages
    }
    // this handler handles the case where the user is not in the chat where the message was sent
    const oldChats = queryClient.getQueryData<GetChatsResponse>(["chats"]);
    const chat = oldChats?.chats?.find((chat) => chat._id === newMessage.chatId);
    if (!chat) {
      return;
    }
    const otherUser = chat.participantsInfo.find((p) => p._id !== user?._id);
    Toast.custom(NewMessageToastContent({ message: newMessage, chat }));

    // set the last message of the chat
    queryClient.setQueryData<GetChatsResponse>(["chats"], 
      (data) => {
        const chats = data?.chats || [];
        const updatedChats = chats.map((c) => {
          if (c._id === newMessage.chatId) {
            return {
              ...c,
              lastMessage: {
                senderName: otherUser?.firstName ?? "",
                message: newMessage.content,
                timestamp: newMessage.timestamp,
              },
            };
          }
          return c;
        });
        return {
          chats: updatedChats,
        };
      }
    )
  }

  static async subscribe() {
    console.log("subscribing to socket events");
    socket.on("matchRequest", SocketController.handleNewMatchRequest);
    socket.on("newChat", SocketController.handleNewChat);
    socket.on("newMessage", SocketController.handleNewMessage);
  }
}

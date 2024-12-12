import { io } from "socket.io-client";
import {
  NewChatToastContent,
  NewMessageToastContent,
} from "@/components/app/NewChatToastContent";
import { queryClient } from "@/app/_layout";
import { Toast } from "@/components/ui/toast";
import { GetChatsResponse } from "@/types/api/GetChats";
import { GetMatchRequestsResponse } from "@/types/api/GetMatchRequests";
import { GetMessagesResponse } from "@/types/api/GetMessages";
import { Chat } from "@/types/Chat";
import { MatchRequest } from "@/types/MatchRequest";
import { Message } from "@/types/Message";
import { getDefaultStore } from "jotai";
import { currentChatIdAtom } from "@/utils/atoms/currentChatAtom";
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
    console.log("socket controller got a new message");
    const currentChat = store.get(currentChatIdAtom);
    const user = store.get(userAtom);
    const noToast = currentChat === newMessage.chatId;
    const oldChats = queryClient.getQueryData<GetChatsResponse>(["chats"]);
    const chat = oldChats?.chats?.find(
      (chat) => chat._id === newMessage.chatId
    );
    if (!chat) {
      return;
    }
    const otherUser = chat.participants.find((p) => p._id !== user?._id);
    !noToast &&
      Toast.custom(NewMessageToastContent({ message: newMessage, chat }));

    queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
      const chats = data?.chats || [];
      const updatedChats = chats.map((c) => {
        if (c._id === newMessage.chatId) {
          return {
            ...c,
            lastMessage: {
              senderId: otherUser?._id ?? "",
              message:
                newMessage.contentType === "text"
                  ? newMessage.content
                  : "📷 Image",
              timestamp: newMessage.timestamp,
            },
          };
        }
        return c;
      });
      return {
        chats: updatedChats,
      };
    });
    newMessage.timestamp = new Date(newMessage.timestamp);
    if (newMessage.userId === user?._id) {
      return; // handled in useSendMessage mutation
    }

    const oldMessages = queryClient.getQueryData<GetMessagesResponse>([
      "messages",
      newMessage.chatId,
    ]);
    if (!!oldMessages?.messages?.some((msg) => msg._id === newMessage._id)) {
      return;
    }
    queryClient.setQueryData<GetMessagesResponse>(
      ["messages", newMessage.chatId],
      (data) => {
        return {
          messages: [...(data?.messages || []), newMessage],
        };
      }
    );
  }
  static handleChatDeleted(deletedChatId: string) {
    const currentChat = store.get(currentChatIdAtom);
    if (deletedChatId === currentChat) {
      store.set(currentChatIdAtom, null);
    }
    queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
      return {
        chats: data?.chats?.filter((chat) => chat._id !== deletedChatId) || [],
      };
    });
    queryClient.invalidateQueries({queryKey: ["chat"]})
  }


  static async subscribe() {
    console.log("subscribing to socket events");
    socket.on("matchRequest", SocketController.handleNewMatchRequest);
    socket.on("newChat", SocketController.handleNewChat);
    socket.on("newMessage", SocketController.handleNewMessage);
    socket.on("chatDeleted", SocketController.handleChatDeleted);
  }
}

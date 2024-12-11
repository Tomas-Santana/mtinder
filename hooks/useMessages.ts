import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { socket } from "@/api/controllers/SocketController";
import ChatController from "@/api/controllers/ChatController";
import type { Message } from "@/types/Message";
import { GetMessagesResponse } from "@/types/api/GetMessages";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { User } from "@/types/User";

export const useMessages = (chatId: string) => {
  const messagesQuery = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => ChatController.getMessages(chatId),
  });
  const queryClient = useQueryClient();
  const [chatDeleted, setChatDeleted] = useState(false);

  const user = useAtomValue(userAtom);

  if (!user) {
    throw new Error("User not found");
  }

  useFocusEffect(
    useCallback(() => {
      socket.on("newMessage", (newMessage: Message) => {
        handleNewMessage(newMessage, queryClient, chatId, user);
      });

      socket.on("deleteMessage", (messageId: string, chatId: string) => {
        handleDeleteMessage(messageId, chatId, queryClient, chatId);
      });

      socket.on("editMessage", (messageId: string, chatId: string, newText: string) => {
        handleEditMessage(messageId, chatId, newText, queryClient, chatId);
      });

      socket.on("deleteChat", (deletedChatId: string) => {
        if (deletedChatId === chatId) {
          setChatDeleted(true);
        }
      });

      return () => {
        socket.off("newMessage");
        socket.off("deleteMessage");
        socket.off("editMessage");
        socket.off("deleteChat");
      };
    }, []));

  return { messagesQuery, chatDeleted };
};

const handleNewMessage = (newMessage: Message, queryClient: QueryClient, currentChatId: string, user: User) => {
  if (newMessage.chatId !== currentChatId) {
    return; // it is handled elsewhere
  }
  if (newMessage.userId === user._id) {
    return; // handled in useSendMessage mutation
  }

  newMessage.timestamp = new Date(newMessage.timestamp);

  console.log("newMessage");

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
};

const handleDeleteMessage = (messageId: string, chatId: string, queryClient: QueryClient, currentChatId: string) => {

  if (chatId !== currentChatId) {
    return; // it is handled elsewhere
  }
  queryClient.setQueryData<GetMessagesResponse>(
    ["messages", chatId],
    (data) => {
      return {
        messages: data?.messages?.filter((msg) => msg._id !== messageId) || [],
      };
    }
  );
};

const handleEditMessage = (messageId: string, chatId: string, newText: string, queryClient: QueryClient, currentChatId: string) => {
  if (chatId !== currentChatId) {
    return; // it is handled elsewhere
  }
  queryClient.setQueryData<GetMessagesResponse>(
    ["messages", chatId],
    (data) => {
      return {
        messages: data?.messages?.map((msg) =>
          msg._id === messageId ? { ...msg, text: newText } : msg
        ) || [],
      };
    }
  );
}


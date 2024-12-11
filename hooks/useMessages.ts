import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { socket } from "@/api/controllers/SocketController";
import ChatController from "@/api/controllers/ChatController";
import type { Message } from "@/types/Message";
import { GetMessagesResponse } from "@/types/api/GetMessages";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";

export const useMessages = (chatId: string) => {
  const messagesQuery = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => ChatController.getMessages(chatId),
  });
  const queryClient = useQueryClient();
  const [chatDeleted, setChatDeleted] = useState(false);

  useEffect(() => {
    if (messagesQuery.data?.deleted) {
      setChatDeleted(true);
    }
  });

  const user = useAtomValue(userAtom);

  if (!user) {
    throw new Error("User not found");
  }

  useFocusEffect(
    useCallback(() => {

      socket.on("deleteMessage", (messageId: string, chatId: string) => {
        handleDeleteMessage(messageId, chatId, queryClient, chatId);
      });

      socket.on("editMessage", (messageId: string, chatId: string, newText: string) => {
        handleEditMessage(messageId, chatId, newText, queryClient, chatId);
      });

      socket.on("deleteChat", (deletedChatId: string) => {
        handleDeleteChat(deletedChatId, chatId, setChatDeleted);
      });

      return () => {
        socket.off("deleteMessage", handleDeleteMessage);
        socket.off("editMessage", handleEditMessage);
        socket.off("deleteChat", handleDeleteChat);
      };
    }, []));

  return { messagesQuery, chatDeleted };
};

const handleDeleteChat = (deletedChatId: string, currentChatId: string, setChatDeleted: (deleted: boolean) => void) => {
  console.log("deleted chat", deletedChatId, currentChatId);
  if (deletedChatId === currentChatId) {
    setChatDeleted(true);
  }
} 



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


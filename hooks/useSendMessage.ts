import ChatController from "@/api/controllers/ChatController";
import SocketController from "@/api/controllers/SocketController";
import { GetMessagesResponse } from "@/types/api/GetMessages";
import { GetChatsResponse } from "@/types/api/GetChats";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { SendMessage } from "@/types/api/SendMessage";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";


export const useSendMessage = (chatId: string) => {
  const user = useAtomValue(userAtom);
  if (!user) {
    throw new Error("User not found");
  }
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (message: SendMessage) =>
      ChatController.sendMessage(chatId, message),
    onMutate: async (newMessage: SendMessage) => {
      const oldMessages = queryClient.getQueryData<GetMessagesResponse>([
        "messages",
        chatId,
      ]);
      const randomId = "temp" + Math.random().toString(36).substring(7);
      queryClient.setQueryData<GetMessagesResponse>(["messages", chatId], {
        messages: [
          ...(oldMessages?.messages || []),
          {
            ...newMessage,
            _id: randomId,
            timestamp: new Date(),
            chatId,
            userId: user._id,
          },
        ],
      });
      const oldLastMessage = queryClient.getQueryData<GetChatsResponse>([
        "chats",
      ])?.chats?.find((chat) => chat._id === chatId)?.lastMessage ?? null;

      queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
        const chats = data?.chats || [];
        const updatedChats = chats.map((c) => {
          if (c._id === chatId) {
            return {
              ...c,
              lastMessage: {
                senderId: user._id,
                message: newMessage.contentType === "text" ? newMessage.content : "📷 Image",
                timestamp: new Date(),
              },
            };
          }
          return c;
        });
        return {
          chats: updatedChats,
        };
      });

      return { oldMessages, randomId, oldLastMessage };
    },
    onError: (error, variables, context) => {
      if (!context?.oldMessages || !context?.randomId || !context?.oldLastMessage) {
        return;
      }
      queryClient.setQueryData<GetMessagesResponse>(
        ["messages", chatId],
        context?.oldMessages
      );

      queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
        const chats = data?.chats || [];
        const updatedChats = chats.map((c) => {
          if (c._id === chatId) {
            return {
              ...c,
              lastMessage: context.oldLastMessage,
            };
          }
          return c;
        });
        return {
          chats: updatedChats,
        };
      });
    },
    onSuccess(data, variables, context) {
      if (!context?.randomId) {
        return;
      }
      queryClient.setQueryData<GetMessagesResponse>(["messages", chatId], {
        messages: queryClient
          .getQueryData<GetMessagesResponse>(["messages", chatId])
          ?.messages.map((msg) =>
            msg._id === context.randomId ? { ...msg, ...data } : msg
          ) || [],
      });

        
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });

  const sendMessage = (message: SendMessage) => {
    mutate(message);
  };

  return { sendMessage };
};

export const useDeleteMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (messageId: string) =>
      ChatController.deleteMessage(chatId, messageId),
    onMutate: async (messageId: string) => {
      const oldMessages = queryClient.getQueryData<GetMessagesResponse>([
        "messages",
        chatId,
      ]);
      queryClient.setQueryData<GetMessagesResponse>(["messages", chatId], {
        messages: oldMessages?.messages.filter((msg) => msg._id !== messageId) || [],
      });
      return { oldMessages };
    },
    onError: (error, variables, context) => {
      if (!context?.oldMessages) {
        return;
      }
      queryClient.setQueryData<GetMessagesResponse>(
        ["messages", chatId],
        context?.oldMessages
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });

  const deleteMessage = (messageId: string) => {
    mutate(messageId);
  };

  return { deleteMessage };
};

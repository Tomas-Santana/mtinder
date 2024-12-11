import ChatController from "@/api/controllers/ChatController";
import SocketController from "@/api/controllers/SocketController";
import { GetMessagesResponse } from "@/types/api/GetMessages";
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
      const randomId = Math.random().toString(36).substring(7);
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
      return { oldMessages, randomId };
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

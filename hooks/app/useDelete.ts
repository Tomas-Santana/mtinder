import ChatController from "@/api/controllers/ChatController";
import { GetChatsResponse } from "@/types/api/GetChats";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteChats = () => {
  const queryClient = useQueryClient()

  const deleteChatMutation = useMutation({
    mutationFn: ChatController.deleteChat,
    onMutate: async ({_id}) => {
      queryClient.cancelQueries({ queryKey: ["chats"] })

      const previousChats = queryClient.getQueryData<GetChatsResponse>(["chats"])

      if(previousChats && previousChats.chats) {
        queryClient.setQueryData<GetChatsResponse>(["chats"], {
          chats: previousChats.chats.filter(chat => chat._id !== _id),
        })
      }

      return { previousChats }
    },
    onError: (error, _ , context) => {
      queryClient.setQueryData(["chats"], context?.previousChats)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    }
  })

  return deleteChatMutation
}
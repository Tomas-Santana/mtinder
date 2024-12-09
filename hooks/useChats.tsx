import { useQuery, useQueryClient } from "@tanstack/react-query"
import ChatController from "@/api/controllers/ChatController"
import socket from "@/api/controllers/SocketController"
import { Chat } from "@/types/Chat"

export const useChats = () => {
  const chatsQuery = useQuery({
    queryFn: ChatController.getChats,
    queryKey: ["chats"],
  })
  const queryClient = useQueryClient()

  socket.on("newChat", (newChat: Chat) => {
    queryClient.setQueryData(["chats"], (oldChats: Chat[]) => {
      return [...oldChats, newChat]
    })
    queryClient.invalidateQueries({queryKey: ["chats"], exact: true})
  })

  return chatsQuery
}
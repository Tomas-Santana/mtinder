import { useQuery } from "@tanstack/react-query";
import ChatController from "@/api/controllers/ChatController";

export const useChats = () => {
  const chatsQuery = useQuery({
    queryFn: ChatController.getChats,
    queryKey: ["chats"],
  });
  return chatsQuery;
};



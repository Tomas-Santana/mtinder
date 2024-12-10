import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatController from "@/api/controllers/ChatController";
import socket from "@/api/controllers/SocketController";
import { Chat } from "@/types/Chat";
import { GetChatsResponse } from "@/types/api/GetChats";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { Toast } from "@/components/ui/toast";
import { View } from "react-native";
import { Link } from "expo-router";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import { useEffect } from "react";

export const useChats = () => {
  const chatsQuery = useQuery({
    queryFn: ChatController.getChats,
    queryKey: ["chats"],
  });
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);


  useEffect(() => {
    const handleNewChat = (newChat: Chat) => {
      const oldChats = queryClient.getQueryData<GetChatsResponse>(["chats"]);
      if (!!oldChats?.chats?.some((chat) => chat._id === newChat._id)) {
        return;
      }

      console.log("new chat", user?.email);
      Toast.custom(<ToastContent chatId={newChat._id} />);
      queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
        return {
          chats: [...(data?.chats || []), newChat],
        };
      });
      queryClient.invalidateQueries({ queryKey: ["chats"], exact: true });
    };

    socket.on("newChat", handleNewChat);

    return () => {
      socket.off("newChat", handleNewChat);
    };
  }, [queryClient]);

  return chatsQuery;
};

// dont register to socket events
export const useChatsNoRegister = () => {
    const chatsQuery = useQuery({
    queryFn: ChatController.getChats,
    queryKey: ["chats"],
  });
  return chatsQuery;
}

function ToastContent({ chatId }: { chatId: string }) {
  return (
    <View style={[mt.w("full"), mt.px(4)]}>
      <View
        style={[
          mt.w("full"),
          mt.bg("blackOpacity", 100, 0.9),
          mt.p(2),
          mt.flexCol,
          mt.items("center"),
          mt.justify("flex-start"),
          mt.rounded("md"),
          mt.glow("md", "green"),
        ]}
      >
        <Text style={[mt.color("white")]}>You have a new match!</Text>
        <Link href={`/chat/${chatId}`}>
          <Text size="xl" style={[mt.color("green"), mt.underline]}>
            Go to chat
          </Text>
        </Link>
      </View>
    </View>
  );
}

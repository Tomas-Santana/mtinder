import mt from "@/style/mtWind";
import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "../ui/text";
import type { Chat } from "@/types/Chat";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export function ChatToastContent({ chat }: { chat: Chat }) {
  const user = useAtomValue(userAtom);
  const otherUser = useMemo(() => {
    return chat.participantsInfo.find((p) => p._id !== user?._id);
  }, [chat, user]);
    const route = useMemo(() => {
      return `/chat/${chat._id}?otherUserId=${
        otherUser?._id ?? ""
      }&otherUserName=${otherUser?.firstName ?? ""} ${
        otherUser?.lastName ?? ""
      }&otherUserImageB64=${btoa(otherUser?.profilePicture ?? "")}` as const;
    }, [otherUser, chat]);
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
        <Link href={route}>
          <Text size="xl" style={[mt.color("green"), mt.underline]}>
            Go to chat
          </Text>
        </Link>
      </View>
    </View>
  );
}

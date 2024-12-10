import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Chat } from "@/types/Chat";
import { Text } from "../ui/text";
import { Image, View } from "react-native";
import mt from "@/style/mtWind";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Modal } from "react-native";

interface ChatPreviewProps {
  chat: Chat;
}

export function ChatPreview({ chat }: ChatPreviewProps) {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const [profilePicModalVisible, setProfilePicModalVisible] = useState(false);
  const otherUser = useMemo(() => {
    return chat.participantsInfo.find((p) => p._id !== user?._id);
  }, [chat, user]);

  const lastMessageContent = useMemo(() => {
    const content = chat.lastMessage?.message ?? "Say hi to your new friend!";
    return content.length > 30 ? content.slice(0, 30) + "..." : content;
  }, [chat]);

  const lastMessageSender = useMemo(() => {
    if (!chat.lastMessage) return "";
    if (chat.lastMessage.senderName === "Mellow Mates") return ""
    return `${chat.lastMessage.senderName}: `;
  }, [chat, user]);
  return (
    <Animated.View
      style={[
        mt.flex,
        mt.flexCol,
        mt.justify("space-between"),
        mt.items("center"),
        mt.w("full"),
      ]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <TouchableOpacity
        style={[
          mt.flex,
          mt.flexRow,
          mt.justify("space-between"),
          mt.items("center"),
          mt.w("full"),
          mt.p(4),
          mt.borderColor("gray", 300),
          mt.gap(4),
        ]}

        onPress={() => router.push(`/chat/${chat._id}`)}
      >

        <TouchableOpacity style={[mt.w(12), mt.h(12), mt.rounded("full"), mt.glow()]}
          onPress={() => setProfilePicModalVisible(true)}
        >
          <Image
            source={{ uri: otherUser?.profilePicture || undefined }}
            style={[mt.w(12), mt.h(12), mt.rounded("full")]}
          />
        </TouchableOpacity>

        <View
          style={[
            mt.flexCol,
            mt.flex1,
            mt.justify("center"),
            mt.items("flex-start"),
          ]}
        >
          <Text style={[mt.color("white"), mt.fontSize("lg")]}>
            {otherUser?.firstName} {otherUser?.lastName}
          </Text>
          <Text style={[mt.color("white")]}>
            {lastMessageSender} {lastMessageContent}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={[mt.pxh(1), mt.w("full"), mt.glow("sm"), mt.bg("blue", 300)]}></View>

      <ProfilePicModal
        visible={profilePicModalVisible}
        setVisible={setProfilePicModalVisible}
        profilePicture={otherUser?.profilePicture || ""}
      />
    </Animated.View>
  );
}

function ProfilePicModal({ visible, setVisible, profilePicture }: { visible: boolean, setVisible: (v: boolean) => void, profilePicture: string }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={[mt.flex1, mt.bg("blackOpacity", 500, 0.7), mt.justify("center"), mt.items("center")]}>
        <TouchableOpacity onPress={() => setVisible(false)}
          style={[mt.flex1, mt.w("full"), mt.justify("center"), mt.items("center"), mt.p(10)]}
          >
            <View
              style={[mt.w(72), mt.h(72), mt.glow(), mt.rounded("lg") ]}
            >

          <Image
            source={{ uri: profilePicture }}
            style={[mt.w("full"), mt.h("full"), mt.bg("blackOpacity", 500), mt.rounded("lg")]}
          />
            </View>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}


import mt from "@/style/mtWind";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import type { Chat } from "@/types/Chat";
import { userAtom } from "@/utils/atoms/userAtom";
import { currentChatAtom } from "@/utils/atoms/currentChatAtom";
import { getDefaultStore } from "jotai";
import { Message } from "@/types/Message";
import { router } from "expo-router";
import { Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function NewChatToastContent({ chat }: { chat: Chat }) {

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
          mt.glow("md", "blue"),
        ]}
      >
        <Text style={[mt.color("white")]}>You have a new match!</Text>
        <Link
          href={`/chat`}
          onPress={() => {
            getDefaultStore().set(currentChatAtom, chat);
          }}
        >
          <Text style={[mt.color("green"), mt.underline, mt.fontSize("2xl")]}>
            Go to chat
          </Text>
        </Link>
      </View>
    </View>
  );
}

export function NewMessageToastContent({ message, chat }: { message: Message, chat: Chat }) {
  const user = getDefaultStore().get(userAtom);
  const otherUser = chat.participants.find((p) => p._id !== user?._id);

  const route = `/chat/${chat._id}?otherUserId=${
    otherUser?._id ?? ""
  }&otherUserName=${otherUser?.firstName ?? ""} ${
    otherUser?.lastName ?? ""
  }&otherUserImage=${encodeURIComponent(otherUser?.imageUrls?.[0] ?? "")}` as const;

  const messageContent = message.content.length > 30 ? message.content.slice(0, 30) + "..." : message.content;

  return (
    <TouchableOpacity style={[mt.w("full"), mt.px(4)]}
      onPress={() => {
        getDefaultStore().set(currentChatAtom, chat);
        router.push(route)
      }}
    >
      <View
        style={[
          mt.w("full"),
          mt.bg("blackOpacity", 100, 0.9),
          mt.p(4),
          mt.flexRow,
          mt.items("center"),
          mt.justify("flex-start"),
          mt.rounded("md"),
          mt.gap(4),
          mt.glow("md", "blue"),
        ]}
      >
        <View
          // image
          style={[mt.w(12), mt.h(12), mt.rounded("full")]}
        >
          <Image
            source={{ uri: otherUser?.imageUrls?.[0] || undefined }}
            style={[mt.w("full"), mt.h("full"), mt.rounded("full")]}
            
          />
        </View>



        <View
          style={[mt.flexCol, mt.items("flex-start"), mt.justify("center")]}
        >
          <Text style={[mt.color("white"), mt.fontSize("lg")]}>{otherUser?.firstName}</Text>
          <Text style={[mt.color("white")]}>
            {message.contentType === "text" ? messageContent : "📷 Image"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function NormalToastContent({ message, variant }: { message: string, variant: "success" | "error" | "info" }) {
  const icon = {
    success: "check-circle",
    error: "alert-circle",
    info: "information",
  }[variant] as keyof typeof MaterialCommunityIcons.glyphMap;

  const glowColor = {
    success: "green",
    error: "red",
    info: "blue",
  }[variant] as "green" | "red" | "blue";

  return (
    <View style={[mt.w("full"), mt.px(4)]}>
      <View
        style={[
          mt.w("full"),
          mt.bg("blackOpacity", 100, 0.9),
          mt.p(2),
          mt.py(4),
          mt.flexRow,
          mt.items("center"),
          mt.justify("flex-start"),
          mt.rounded("md"),
          mt.glow("md", glowColor),
        ]}
      >
        <MaterialCommunityIcons name={icon} size={24}
          style={[mt.color(glowColor)]}
        />
        <Text style={[mt.color(glowColor), mt.ml(2)]}>{message}</Text>
      </View>
    </View>
  );
}

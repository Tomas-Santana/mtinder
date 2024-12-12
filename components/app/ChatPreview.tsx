import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Chat } from "@/types/Chat";
import { Text } from "../ui/text";
import { Image, Pressable, TouchableWithoutFeedback, View } from "react-native";
import mt from "@/style/mtWind";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Modal } from "react-native";
import { Swipeable } from "./swipeable";
import { useDeleteChats } from "@/hooks/app/useDelete";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSetAtom } from "jotai";
import { currentChatAtom } from "@/utils/atoms/currentChatAtom";
import PagerView from "react-native-pager-view";
import { ProfilePicModal } from "./ProfilePicModal";

interface ChatPreviewProps {
  chat: Chat;
}

export function ChatPreview({ chat }: ChatPreviewProps) {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const deleted = useDeleteChats();
  const [profilePicModalVisible, setProfilePicModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0)
  const otherUser = useMemo(() => {
    return chat.participants.find((p) => p._id !== user?._id);
  }, [chat, user]);

  const setCurrentChat = useSetAtom(currentChatAtom);

  const isMine = chat.lastMessage?.senderId === user?._id;
  const isNew = chat.lastMessage?.senderId === "mm";

  const onSwipe = () => {
    deleted.mutate({ _id: chat._id });
  };

  useEffect(() => {
    console.log("chat", JSON.stringify(chat));
  }, [chat]);

  const lastMessageContent = useMemo(() => {
    const content = (
      chat.lastMessage?.message ?? "Say hi to your new friend!"
    ).replace(/\n/g, " ");
    return content.length > 20 ? content.slice(0, 20) + "..." : content;
  }, [chat]);

  const route = useMemo(() => {
    return `/chat/${chat._id}` as const;
  }, [otherUser, chat]);

  const time = useMemo(() => {
    const messageDate = new Date(chat.lastMessage?.timestamp ?? new Date());
    const today = new Date();
    const isToday = messageDate.toDateString() === today.toDateString();
    return isToday
      ? messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : `${messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
  }, [chat]);

  return (
    <Swipeable onSwipeAction={onSwipe}>
      <Animated.View
        style={[
          mt.flex,
          mt.flexCol,
          mt.justify("space-between"),
          mt.items("center"),
          mt.w("full"),
          mt.bg("gray", 800)
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
          onPress={() => {
            setCurrentChat(chat);
            router.push(route);
          }}
        >
          <TouchableOpacity
            style={[mt.w(12), mt.h(12), mt.rounded("full"), mt.glow()]}
            onPress={() => {setProfilePicModalVisible(true)
              console.log("Abrete sesamo")
            }}
          >
            <Image
              source={{ uri: otherUser?.imageUrls?.[0] || undefined }}
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
              {otherUser?.firstName} {otherUser?.lastName} {"  "}{" "}
              {isNew && (
                <Text
                  style={[
                    mt.color("green"),
                    mt.fontSize("lg"),
                    mt.glow("sm", "green"),
                  ]}
                >
                  New!
                </Text>
              )}
            </Text>
            <View
              style={[mt.flexRow, mt.justify("space-between"), mt.w("full")]}
            >
              <Text style={[mt.color("white")]}>{lastMessageContent}</Text>

              <Text style={[mt.color("gray"), mt.align("right")]}>
                {time}

                {"  "}

                {isMine && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color="white"
                  />
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={[mt.pxh(1), mt.w("full"), mt.glow("sm"), mt.bg("blue", 300)]}
        ></View>

        <ProfilePicModal
          visible={profilePicModalVisible}
          setVisible={setProfilePicModalVisible}
          profilePicture={otherUser?.imageUrls || []}
        />
      </Animated.View>
    </Swipeable>
  );
}

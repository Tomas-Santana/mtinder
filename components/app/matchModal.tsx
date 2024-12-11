import { Modal, View, Image } from "react-native";
import { Text } from "../ui/text";
import { GlowingText } from "../ui/text";
import { Button } from "../ui/button";
import { User } from "@/types/User";
import mt from "@/style/mtWind";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { currentChatAtom } from "@/utils/atoms/currentChatAtom";
import { useAtomValue, useSetAtom } from "jotai";
import type { Chat, ReducedChat } from "@/types/Chat";
import { userAtom } from "@/utils/atoms/userAtom";

interface MatchModalProps {
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  user: User | null;
  chat: ReducedChat | null;
  onCancel: () => void;
}
export function MatchModal({
  chat,
  setIsOpen,
  isOpen,
  user,
  onCancel,
}: MatchModalProps) {
  const currentUser = useAtomValue(userAtom);
  const router = useRouter();
  const route = useMemo(() => {
    return `/chat/${chat?._id}` as const;
  }, [user, chat]);
  const setCurrentChat = useSetAtom(currentChatAtom);
  const fullChat = useMemo<Chat | null>(() => {
    if (!chat || !user || !currentUser) return null;

    return {
      ...chat,
      messages: [],
      participants: [user, currentUser],
    };
  }, [chat, user, currentUser]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
        onCancel();
      }}
      style={[mt.p(10)]}
    >
      <View
        style={[
          mt.w("full"),
          mt.h("full"),
          // mt.bg("black"),
          mt.p(4),
          mt.flexCol,
          mt.justify("center"),
          mt.items("center"),
          mt.rounded("lg"),
          mt.overflow("hidden"),
        ]}
      >
        <View
          style={[
            mt.w("full"),
            mt.h("full"),
            mt.rounded("lg"),
            mt.flexCol,
            mt.justify("center"),
            mt.items("center"),
            mt.gap(4),
            mt.glow(),
            mt.bg("blackOpacity", 800, 0.9),
            mt.p(5),
          ]}
        >
          <View style={[mt.w(40), mt.h(40), mt.rounded("full"), mt.glow()]}>
            <Image
              source={{ uri: user?.imageUrls?.[0] }}
              style={[mt.w("full"), mt.h("full"), mt.rounded("full")]}
            />
          </View>
          <GlowingText
            size="2xl"
            style={[mt.fontSize("2xl"), mt.color("blue"), mt.align("center")]}
            color="#80E1FF"
          >
            You have a matched with {user?.firstName}!
          </GlowingText>
          <Button
            variant="primary"
            disabled={!fullChat}
            onPress={() => {
              setIsOpen(false);
              router.push(route);
              setCurrentChat(fullChat);
            }}
          >
            <Text>{fullChat ? "Chat Now!" : "Setting up your friendship..."}</Text>
          </Button>
          <Button
            onPress={() => {
              onCancel();
              setIsOpen(false);
            }}
            variant="secondary"
          >
            <Text>Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

import { Modal, View, Image } from "react-native";
import { Text } from "../ui/text";
import { GlowingText } from "../ui/text";
import { Button } from "../ui/button";
import { Link } from "expo-router";
import { User } from "@/types/User";
import mt from "@/style/mtWind";
import { useRouter } from "expo-router";
import { BlurView } from 'expo-blur';

interface MatchModalProps {
  chatId: string | null;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  user: User | null;
  onCancel: () => void;
}
export function MatchModal({ chatId, setIsOpen, isOpen, user, onCancel }: MatchModalProps) {
  const router = useRouter();
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
            disabled={!chatId}
            onPress={() => {
              setIsOpen(false);
              router.push(`/chat/${chatId}`);
            }}
          >
            <Text>{chatId ? "Chat" : "Setting up your friendship..."}</Text>
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

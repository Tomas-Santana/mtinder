import mt from "@/style/mtWind";
import { Link } from "expo-router";
import { View } from "react-native";
import { Text } from "../ui/text";

export function ChatToastContent({ chatId }: { chatId: string }) {
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

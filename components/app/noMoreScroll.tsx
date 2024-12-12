import { GlowingText, Text } from "../ui/text";
import { View } from "react-native";
import mt from "@/style/mtWind";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

export function NoMoreScroll() {
  return (
    <Animated.View 
    style={[mt.flex1, mt.justify("center"), mt.items("center")]}>
      <View
        style={[
          mt.flexCol,
          mt.gap(4),
          mt.justify("center"),
          mt.items("center"),
          mt.rounded("base"),
          mt.glow("md", "blue"),
          mt.p(4),
          mt.w(80),
        ]}
      >
        <MaterialCommunityIcons
          name="grass"
          size={48}
          style={[mt.color("blue"), mt.textGlow("sm", "blue")]}
        />
        <View style={[mt.flexCol, mt.gap(3)]}>
          <GlowingText
            color="#80E1FF"
            style={[mt.fontSize("lg"), mt.color("blue"), mt.align("center")]}
          >
            It's over!
          </GlowingText>
          <Text style={[mt.align("center"), mt.color("white")]}>
            Enough scrolling for today, time to go out and enjoy your loneliness.
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

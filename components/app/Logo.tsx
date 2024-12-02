import mt from "@/style/mtWind";
import { View } from "react-native";
import { NeonGlow } from "../ui/glow";
import { GlowingText } from "../ui/text";

export default function Logo() {
  return (
    <NeonGlow mtColor="blue" viewStyles={[mt.p(2), mt.rounded("full"), mt.border(2), mt.borderColor("blue", 200)]}>
      <View
        style={[
          mt.flexRow,
          mt.gap(2),
          mt.items("center"),
          mt.justify("center"),
        ]}
      >
        <GlowingText
          style={[mt.fontSize("xl"), mt.color("blue", 300), mt.spacing(2)]}
          color="#39DBFF"
        >
          🎵
        </GlowingText>
        <GlowingText
          style={[
            mt.fontSize("xl"),
            mt.color("blue", 200),
            mt.spacing(2),
            mt.align("center"),
          ]}
          color="#39DBFF"
        >
          Mellow{"\n"}Mates
        </GlowingText>
        <GlowingText
          style={[mt.fontSize("xl"), mt.color("blue", 200), mt.spacing(2)]}
          color="#39DBFF"
        >
          🎵
        </GlowingText>
      </View>
    </NeonGlow>
  );
}
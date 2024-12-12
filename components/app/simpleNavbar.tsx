import mt from "@/style/mtWind";
import { TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { GlowingText } from "../ui/text";

export function SimpleNavbar() {
  const router = useRouter();

  return (
    <View
      style={[mt.w("full"), mt.flexRow, mt.justify("space-between"), mt.px(4), mt.pt(4)]}
    >
      {/* go back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={32} color="red" style={[mt.textGlow("md", "red")]}/>
      </TouchableOpacity>
    </View>
  )
}

export function SimpleNavbarWithTitle({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View
      style={[
        mt.w("full"),
        mt.flexRow,
        mt.justify("flex-start"),
        mt.items("center"),
        mt.gap(4),
        mt.p(4),
        mt.bg("gray", 900),
      ]}
    >
      {/* go back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={32}
          color="red"
          style={[mt.textGlow("md", "red")]}
        />
      </TouchableOpacity>
      <GlowingText
        style={[mt.color("white"), mt.fontSize("2xl")]}
        color="#80E1FF"
      >
        {title}
      </GlowingText>
    </View>
  );
}
import mt from "@/style/mtWind";
import { Button } from "../ui/button";
import { TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export function SimpleNavbar() {
  const router = useRouter();

  return (
    <View
      style={[mt.w("full"), mt.flexRow, mt.justify("space-between"), mt.px(4)]}
    >
      {/* go back button */}
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="red" style={[mt.textGlow("md", "red")]}/>
      </TouchableOpacity>
    </View>
  )
}
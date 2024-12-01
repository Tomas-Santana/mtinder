import { TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import mt from "@/style/mtWind";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={[mt.flexRow, mt.gap(3), mt.justify("flex-end"), mt.items("center")]}>
      <TouchableOpacity onPress={() => router.push("/profile/settings")}>
        <MaterialCommunityIcons name="home" size={24} color="white" style={[mt.textGlow("md", "white")]}/>
      </TouchableOpacity>
    </View>
  )
}
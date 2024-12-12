import { TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import mt from "@/style/mtWind";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { Image } from "react-native";

export default function Navbar() {
  const router = useRouter();
  const user = useAtomValue(userAtom);


  return (
    <View style={[mt.flexRow, mt.gap(3), mt.justify("flex-end"), mt.items("flex-end"), mt.w("full"), mt.px(4), mt.pt(4)]}>
      {/* chats */}
      <TouchableOpacity onPress={() => router.push("/chat")}>
        <MaterialCommunityIcons name="chat" size={32} color="white" style={[mt.textGlow("md", "white")]}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/profile/settings")}
        
          style={[mt.rounded("full"), mt.bg("blackOpacity", 100, 0.9), mt.glow("md", "blue")]}
        >
        <Image
          source={{ uri: user?.imageUrls?.[0] }}
          style={[mt.rounded("full"), mt.w(10), mt.h(10)]}
        />
      </TouchableOpacity>
    </View>
  )
}
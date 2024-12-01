import { View } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";

export default function SendReset(){
  return(
    <View>
      <Navbar />
      <Text style={[mt.color("white")]}>Home</Text>
    </View>
  )
}
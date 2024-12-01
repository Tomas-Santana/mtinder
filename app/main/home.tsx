import { View } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";
import SwipeCard from "@/components/app/SwipeCard";

export default function SendReset(){
  return(
    <View style={[mt.flex1, mt.justify("center"), mt.items("center")]}>
      <Navbar />
      <SwipeCard />
    </View>
  )
}
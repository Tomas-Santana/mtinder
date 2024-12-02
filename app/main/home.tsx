import { View } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";
import SwipeCard from "@/components/app/SwipeCard";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { Redirect } from "expo-router";

export default function SendReset(){
  const user = useAtomValue(userAtom);

  if (!user || !user.profileReady) {
    return <Redirect href={"/main/completeProfile"} />
  }

  return(
    <View style={[mt.flex1, mt.justify("center"), mt.items("center")]}>
      <Navbar />
      <SwipeCard />
    </View>
  )
}
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";
import SwipeCard from "@/components/app/SwipeCard";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { Link, Redirect } from "expo-router";
import { useMe } from "@/hooks/useMe";

const data = [
  { id: 1, name: 'Juan' },
  { id: 2, name: 'Maria' },
  { id: 3, name: 'Carlos' },
  { id: 4, name: 'Ana' },
]

export default function SendReset(){
  const user = useAtomValue(userAtom);

  const meQuery = useMe();

  if(!user){
    return <Redirect href="/" />
  }

  if (!meQuery.data?.me.profileReady) {
    return <Redirect href="/main/completeProfile" />
  }



  const liked = () => {
    console.log("Liked"); 
  }

  const disliked = () => {
    console.log("Disliked");
  }

  return(
    <View style={[mt.flex1, mt.justify("center"), mt.items("center")]}>
      <Navbar />
      <SwipeCard onLeftSwipe={disliked} onRightSwipe={liked} cardsData={data}/>
      <Link
        href="/main/completeProfile"
      >
        <Text
          style={[mt.color("white")]}
        >Tommy a complete profile</Text>
      </Link>
    </View>
  )
}
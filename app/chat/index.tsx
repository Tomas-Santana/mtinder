import { View } from "react-native";
import Chat from "@/components/app/Chat";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { User } from "@/types/User";

export default function Chater() {
  const currentUser = useAtomValue(userAtom)
  const { user } = useLocalSearchParams() 

  const userObj = JSON.parse(user as string)

  return (
    <View style={{ flex: 1 }}>
      <Text color="white">{`${currentUser?._id}, ${userObj._id}`}</Text>
      {currentUser && <Chat user1={currentUser} user2={userObj} />}
    </View>
  );
}
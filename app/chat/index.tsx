import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { GlowingText } from "@/components/ui/text";
import mt from "@/style/mtWind";
import { SafeAreaView } from "react-native";
import { useChats } from "@/hooks/useChats";
import { ChatPreview } from "@/components/app/ChatPreview";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleNavbarWithTitle } from "@/components/app/simpleNavbar";

export default function ChatsView() {
  const chatsQuery = useChats();

  useEffect(() => {
    console.log(chatsQuery.data);
  }, [chatsQuery.data]);

  const sortedChats = useMemo(() => {
    // sort chats by last message date
    return chatsQuery.data?.chats?.sort((a, b) => {
      if (!a.lastMessage || !b.lastMessage) return 0;
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    });
  }, [chatsQuery.data]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          mt.flexCol,
          mt.gap(4),
          
          mt.flex1,
        ]}
      >
        <SimpleNavbarWithTitle title="Chats" />
        <Animated.FlatList
          style={[mt.flex1, mt.bg("gray", 900)]}
          contentContainerStyle={[]}
          itemLayoutAnimation={LinearTransition}
          data={sortedChats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (<ChatPreview chat={item} />)}
          ListEmptyComponent={<EmptySplash />}
          extraData={sortedChats}
        />

       {/* {chatsQuery.data?.chats?.map((chat) => (
          <ChatPreview key={chat._id} chat={chat} />
        ))} */}
      </View>
    </SafeAreaView>
  );
}

function EmptySplash() {
  return (
    <View style={[mt.flexCol, mt.justify("center"), mt.items("center"), mt.flex1, mt.p(10)]}>


        <MaterialCommunityIcons name="chat" size={100} color="white"
          style={[mt.textGlow("md", "blue")]}
        />
      <Text size="xl" style={[mt.color("white"), mt.textGlow("md", "blue")]}>No matches yet. Time to swipe!</Text>
    </View>
  );
}

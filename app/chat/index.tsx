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
import { RefreshControl } from "react-native-gesture-handler";
import { Image } from "react-native";

const bg = require("@/assets/images/bg.png");

export default function ChatsView() {
  const chatsQuery = useChats();


  const sortedChats = useMemo(() => {
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
          
          mt.flex1,
        ]}
      >
        <SimpleNavbarWithTitle title="Chats" />
        <Animated.FlatList
          style={[mt.flex1]}
          
          contentContainerStyle={[]}
          itemLayoutAnimation={LinearTransition}
          data={sortedChats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (<ChatPreview chat={item} />)}
          ListEmptyComponent={<EmptySplash />}
          extraData={sortedChats}

          refreshControl={<RefreshControl
          tintColor={"white"}
            refreshing={chatsQuery.isFetching}
            onRefresh={chatsQuery.refetch}
            
          />}
        />

      </View>

      {/* image bg */}
      <Image
        source={bg}
        style={[
          mt.position("absolute"),
          mt.w("full"),
          mt.h("full"),
          mt.opacity(0.5),
          mt.z(-1),
        ]}
      />
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

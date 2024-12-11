import { Text } from "@/components/ui/text";
import {
  Chat,
  MessageType,
  darkTheme,
} from "@flyerhq/react-native-chat-ui";
import mt from "@/style/mtWind";
import { KeyboardAvoidingView, Modal, Pressable, TextInput, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { Image } from "react-native";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import { FlatList, Platform } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { Message } from "@/types/Message";
import { User } from "@/types/User";

export default function Chater() {
  const { id, otherUserName, otherUserImageB64 } = useLocalSearchParams<{
    id: string;
    otherUserId: string;
    otherUserName: string;
    otherUserImageB64: string;
  }>();

  const { messagesQuery } = useMessages(id);
  const { sendMessage } = useSendMessage(id);

  const memoMessages = useMemo(() => {
    return (
      messagesQuery.data?.messages.sort(
        // reverse chronological order
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      ) ?? []
    );
  }, [messagesQuery.data]);
  const [profilePicModalVisible, setProfilePicModalVisible] = useState(false);
  const currentUser = useAtomValue(userAtom);



  // const handleImageSelection = async () => {
  //   const result = await launchImageLibraryAsync({
  //     mediaTypes: "images",
  //     allowsEditing: true,
  //     quality: 1,
  //     base64: true,
  //     selectionLimit: 1,
  //   });

  //   if (result.canceled || !result.assets[0].base64) {
  //     return;
  //   }

  //   const response = result.assets[0];

  //   const imageMessage: MessageType.Image = {
  //     author: user,
  //     createdAt: Date.now(),
  //     height: response.height,
  //     id: uuidv4(),
  //     name: response.fileName || "image",
  //     size: response.fileSize ?? 0,
  //     type: "image",
  //     uri: response.uri,
  //     width: response.width,
  //   };

  //   addMessage(imageMessage);
  // };
  const handleSendPress = (content: string) => {
    sendMessage({
      content: content,
      contentType: "text",
    });
  };
  return (
    <View style={[mt.flexCol, mt.justify("flex-end"), mt.flex1]}>
      {/* header */}
      <View
        style={[
          mt.flexRow,
          mt.justify("flex-start"),
          mt.items("center"),
          mt.p(4),
          mt.bg("gray", 900),
          mt.w("full"),
          mt.gap(4),
        ]}
      >
        <View
          style={[mt.flexRow, mt.items("flex-start"), mt.justify("center")]}
        >
          <TouchableOpacity
            style={[mt.w(12), mt.h(12), mt.rounded("full"), mt.glow()]}
            onPress={() => setProfilePicModalVisible(true)}
          >
            <Image
              source={{ uri: atob(otherUserImageB64) }}
              style={[mt.w(12), mt.h(12), mt.rounded("full")]}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            mt.color("white"),
            mt.fontSize("xl"),
            mt.textGlow("md", "blue"),
          ]}
        >
          {otherUserName}
        </Text>
      </View>

      <Animated.FlatList
        data={memoMessages}
        itemLayoutAnimation={LinearTransition}
        keyExtractor={(item) => item._id}
        style={[mt.flex1]}
        renderItem={({ item, index }) => {
          return <ChatBubble message={item} user={currentUser} />;
        }}
        inverted
      />

      <ChatInput onSend={handleSendPress} />

      <ProfilePicModal
        profilePicture={otherUserImageB64}
        setVisible={setProfilePicModalVisible}
        visible={profilePicModalVisible}
      />
    </View>
  );
}

const ChatBubble = ({ message, user }: { message: Message, user: User | null }) => {
  const isMine = message.userId === user?._id;
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        mt.flexRow,
        mt.justify(
          isMine ? "flex-end" : "flex-start"
        ),
        mt.items(
          isMine ? "flex-end" : "flex-start"
        ),
        mt.p(2),
        mt.w("full"),
      ]}
    >
      <Pressable
        style={[
          mt.rounded("lg"),
          mt.bg(isMine ? "blue" : "gray", 900),
          mt.glow("md", isMine ? "blue" : "green"),
        ]}
      >
        <Text
          style={[
            mt.p(2),
            mt.m(2),
            mt.color("white"),
          ]}
        >
          {message.content}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const ChatInput = ({ onSend }: { onSend: (content: string) => void }) => {
  const [content, setContent] = useState("");
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        mt.flexRow,
        mt.justify("flex-start"),
        mt.items("center"),
        mt.bg("gray", 900),
        mt.w("full"),
        mt.p(4),
      ]}
    >
      <TextInput
        style={[mt.flex1, mt.bg("gray", 800), mt.rounded("full"), mt.p(2)]}
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity
        onPress={() => {
          onSend(content);
          setContent("");
        }}
      >
        <Text style={[mt.color("white"), mt.fontSize("xl"), mt.p(2)]}>
          Send
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}


// const renderBubble = ({
//   child,
//   message,
//   nextMessageInGroup,
// }: {
//   child: ReactNode;
//   message: MessageType.Any;
//   nextMessageInGroup: boolean;
// }) => {
//   const currentUser = useAtomValue(userAtom);
//   const user = {
//     id: currentUser?._id ?? "",
//     firstName: currentUser?.firstName,
//     imageUrl: currentUser?.imageUrls?.[0],
//   };
//   return (
//     <View
//       style={{
//         backgroundColor: user.id !== message.author.id ? "#ffffff" : "#1d1c21",
//         borderBottomLeftRadius:
//           !nextMessageInGroup && user.id !== message.author.id ? 20 : 0,
//         borderBottomRightRadius:
//           !nextMessageInGroup && user.id === message.author.id ? 20 : 0,
//         borderColor: "#1d1c21",
//         borderWidth: 1,
//         overflow: "hidden",
//       }}
//     >
//       {child}
//     </View>
//   );
// };

function ProfilePicModal({
  visible,
  setVisible,
  profilePicture,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  profilePicture: string;
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View
        style={[
          mt.flex1,
          mt.bg("blackOpacity", 500, 0.7),
          mt.justify("center"),
          mt.items("center"),
        ]}
      >
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={[
            mt.flex1,
            mt.w("full"),
            mt.justify("center"),
            mt.items("center"),
            mt.p(10),
          ]}
        >
          <View style={[mt.w(72), mt.h(72), mt.glow(), mt.rounded("lg")]}>
            <Image
              source={{ uri: atob(profilePicture) }}
              style={[
                mt.w("full"),
                mt.h("full"),
                mt.bg("blackOpacity", 500),
                mt.rounded("lg"),
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

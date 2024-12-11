import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native";
import mt from "@/style/mtWind";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { Image } from "react-native";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import { FlatList, Platform } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSetCurrentChat } from "@/hooks/useSetCurrentChat";
import { Toast } from "@/components/ui/toast";
import mime from "mime";

export default function Chater() {
  const { id, otherUserName, otherUserImageB64 } = useLocalSearchParams<{
    id: string;
    otherUserId: string;
    otherUserName: string;
    otherUserImageB64: string;
  }>();

  const { messagesQuery } = useMessages(id);
  const { sendMessage } = useSendMessage(id);
  useSetCurrentChat(id); // set the current chat id in the global state, sets it to null when the component unmounts

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

  const handleImageSelection = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
      base64: true,
      selectionLimit: 1,
    });

    if (result.canceled || !result.assets[0].base64) {
      return;
    }

    const response = result.assets[0];

    if (response.base64) {
      sendMessage({
        content: response.base64,
        contentType: "image",
      });
    } else {
      Toast.error("Failed to send image");
    }
  };
  const handleSendPress = (content: string) => {
    sendMessage({
      content: sanitizeMessage(content),
      contentType: "text",
    });
  };
  return (
    <SafeAreaView style={[mt.flexCol, mt.justify("flex-end"), mt.flex1]}>
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
        contentContainerStyle={[mt.px(2)]}
        style={[mt.flex1]}
        renderItem={({ item }) => {
          return (
            item.contentType === "text" ? (
              <ChatBubble message={item} user={currentUser} />
            ) : (
              <ImageChatBubble message={item} user={currentUser} />
            )
          )
        }}
        inverted
      />

      <ChatInput
        onSend={handleSendPress}
        onAttachmentPress={handleImageSelection}
      />

      <ProfilePicModal
        profilePicture={otherUserImageB64}
        setVisible={setProfilePicModalVisible}
        visible={profilePicModalVisible}
      />
    </SafeAreaView>
  );
}

const ChatBubble = ({
  message,
  user,
}: {
  message: Message;
  user: User | null;
}) => {
  const isMine = message.userId === user?._id;
  const isUploading = message._id.startsWith("temp");
  
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        mt.flexRow,
        mt.justify(isMine ? "flex-end" : "flex-start"),
        mt.items(isMine ? "flex-end" : "flex-start"),
        mt.p(2),
        mt.w("full"),
      ]}
    >
      <Pressable
        style={[
          mt.rounded("lg"),
          mt.bg(isMine ? "blue" : "gray", 900),
          mt.glow("md", isMine ? "blue" : "green"),
          mt.p(2),
          mt.px(4),
          mt.maxW("eighty"),
          mt.flexCol,
          mt.justify("center"),
          mt.items(isMine ? "flex-end" : "flex-start"),
        ]}
      >
        <Text style={[mt.color("white")]}>{message.content}</Text>
        <Text
          style={[
            mt.color("white"),
            mt.fontSize("sm"),
            mt.align(isMine ? "right" : "left"),
          ]}
        >
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {" "}
          {isMine &&
            (isUploading ? (
              <MaterialCommunityIcons
                name="clock"
                size={12}
                color="white"
                style={[mt.ml(1)]}
              />
            ) : (
              <MaterialCommunityIcons
                name="check"
                size={12}
                color="white"
                style={[mt.ml(1)]}
              />
            ))}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const ImageChatBubble = ({
  message,
  user,
}: {
  message: Message;
  user: User | null;
}) => {
  const isMine = message.userId === user?._id;
  // if message.content is base64, then message is not sent yet
  // if message.content is a url, then message is sent
  // b64 doesnt start with "data"

  const uri = useMemo(() => {
    if (message.content.startsWith("http")) {
      return message.content;
    }
    return `data:${mime.getType(message.content)};base64,${message.content}`;
  }, [message.content]);
  const isUploading = message._id.startsWith("temp");
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        mt.flexRow,
        mt.justify(isMine ? "flex-end" : "flex-start"),
        mt.items(isMine ? "flex-end" : "flex-start"),
        mt.p(2),
        mt.w("full"),
      ]}
    >
      <Pressable
        style={[
          mt.rounded("lg"),
          mt.bg(isMine ? "blue" : "gray", 900),
          mt.glow("md", isMine ? "blue" : "green"),
          mt.maxW("eighty"),
          mt.flexCol,
          mt.justify("center"),
          mt.items(isMine ? "flex-end" : "flex-start"),
        ]}
        disabled={isUploading}
      >
        <View
          style={[mt.w(64), mt.h(64), mt.position("relative")]}
        >
          <Image
            source={{ uri: uri }}
            style={[mt.w("full"), mt.h("full"), mt.rounded("lg")]}
          />

        {/* overlay and spinner if is uploading */}
        {isUploading && (
          <View
            style={[
              mt.w("full"),
              mt.h("full"),
              mt.bg("blackOpacity", 500, 0.5),
              mt.justify("center"),
              mt.items("center"),
              mt.position("absolute"),
              mt.rounded("lg"),
            ]}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        </View>
        <Text
          style={[
            mt.color("white"),
            mt.fontSize("sm"),
            mt.align(isMine ? "right" : "left"),
            mt.p(2),
            mt.px(4),
          ]}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {" "}
          {isMine &&
            (message._id.startsWith("temp") ? (
              <MaterialCommunityIcons
                name="clock"
                size={12}
                color="white"
                style={[mt.ml(1)]}
              />
            ) : (
              <MaterialCommunityIcons
                name="check"
                size={12}
                color="white"
                style={[mt.ml(1)]}
              />
            ))}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const ChatInput = ({
  onSend,
  onAttachmentPress,
}: {
  onSend: (content: string) => void;
  onAttachmentPress: () => void;
}) => {
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
        mt.p(2),
      ]}
    >
      <TouchableOpacity onPress={onAttachmentPress}>
        <Text
          style={[
            mt.color("white"),
            mt.fontSize("xl"),
            mt.p(2),
            mt.textGlow("lg", "blue"),
          ]}
        >
          <MaterialCommunityIcons name="attachment" size={24} color="white" />
        </Text>
      </TouchableOpacity>
      <TextInput
        style={[
          mt.flex1,
          mt.bg("gray", 800),
          mt.rounded("sm"),
          mt.p(2),
          mt.color("white"),
        ]}
        value={content}
        onChangeText={setContent}
        // allow for multiline input
        multiline
        maxLength={200}
      />
      <TouchableOpacity
        onPress={() => {
          onSend(content);
          setContent("");
        }}
        disabled={!content.trim()}
      >
        <Text
          style={[
            mt.color("white"),
            mt.fontSize("xl"),
            mt.p(2),

            ...[content.trim() ? mt.textGlow("lg", "blue") : mt.opacity(0.5)],
          ]}
        >
          <MaterialCommunityIcons name="send" size={24} color="white" />
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

function sanitizeMessage(message: string) {
  // max 200 characters, more than two new lines in a row are replaced with two new lines
  return message
    .slice(0, 200)
    .replace(/\n{2,}/g, "\n\n")
    .trim();
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

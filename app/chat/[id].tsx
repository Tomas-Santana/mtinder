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
import { useLocalSearchParams, useRouter } from "expo-router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { currentChatAtom } from "@/utils/atoms/currentChatAtom";
import { Image } from "react-native";
import { useSendMessage, useDeleteMessage } from "@/hooks/useSendMessage";
import { useMessages } from "@/hooks/useMessages";
import { Platform } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSetCurrentChat } from "@/hooks/useSetCurrentChat";
import { Toast } from "@/components/ui/toast";
import { ImageChatBubble, ChatBubble } from "@/components/app/chat/ChatBubble";
import { ProfilePicModal } from "@/components/app/ProfilePicModal";
import { useActionSheet } from "@expo/react-native-action-sheet";

const bg = require("@/assets/images/bg.png");

export default function Chater() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

  const currentChat = useAtomValue(currentChatAtom);
  const currentUser = useAtomValue(userAtom);
  const otherUser = useMemo(() => {
    return currentChat?.participants.find((p) => p._id !== currentUser?._id);
  }, [currentChat, currentUser]);
  const [currentIndex, setCurrentIndex] = useState(0)

  const { messagesQuery, chatDeleted } = useMessages(id);
  useEffect(() => {
    console.log("chat deleted", chatDeleted);
  }, [chatDeleted]);
  const { sendMessage } = useSendMessage(id);
  useSetCurrentChat(id); // set the current chat id in the global state, sets it to null when the component unmounts

  const memoMessages = useMemo(() => {
    return (
      messagesQuery.data?.messages.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      ) ?? []
    );
  }, [messagesQuery.data]);
  const [profilePicModalVisible, setProfilePicModalVisible] = useState(false);

  const { deleteMessage } = useDeleteMessage(id);

  const { showActionSheetWithOptions } = useActionSheet();

  const onMessageLongPress = (messageId: string) => {
    const options = ["Delete", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        title: "Actions"
      },
      (selectedIndex) => {
        if (selectedIndex === 0) deleteMessage(messageId)
      }
    );
  };

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
        {/* go back button */}
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          >
            <MaterialCommunityIcons name="arrow-left" size={32} color={"red"}
            style={[ mt.textGlow("md", "red")]}
            />
          </TouchableOpacity>

        <Animated.View>
          <TouchableOpacity
            style={[mt.w(12), mt.h(12), mt.rounded("full"), mt.glow()]}
            onPress={() => setProfilePicModalVisible(true)}
          >
            <Image
              source={{ uri: otherUser?.imageUrls?.[0] || undefined }}
              style={[mt.w(12), mt.h(12), mt.rounded("full")]}
            />
          </TouchableOpacity>
        </Animated.View>
        <Text
          style={[
            mt.color("white"),
            mt.fontSize("xl"),
            mt.textGlow("md", "blue"),
          ]}
        >
          {otherUser?.firstName} {otherUser?.lastName}
        </Text>
      </View>

      <Animated.FlatList
        data={memoMessages}
        itemLayoutAnimation={LinearTransition}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[mt.px(2)]}
        style={[mt.flex1]}
        renderItem={({ item }) => {
            return item.contentType === "text" ? (
            <ChatBubble
              message={item}
              user={currentUser}
              onLongPress={item.userId === currentUser?._id ? onMessageLongPress : undefined}
            />
            ) : (
            <ImageChatBubble
              message={item}
              user={currentUser}
              onLongPress={item.userId === currentUser?._id ? onMessageLongPress : undefined}
            />
            );
        }}
        inverted
      />

      <ChatInput
        onSend={handleSendPress}
        onAttachmentPress={handleImageSelection}
      />

      <ProfilePicModal
        profilePicture={otherUser?.imageUrls || []}
        setVisible={setProfilePicModalVisible}
        visible={profilePicModalVisible}
      />
      <DeletedChatModal visible={chatDeleted} />


      {/* image bg */}
      <Image
        source={bg}
        style={[
          mt.position("absolute"),
          mt.top(0),
          mt.left(0),
          mt.w("full"),
          mt.h("full"),
          mt.opacity(0.5),
          mt.z(-1)
        ]}
      />
    </SafeAreaView>
  );
}

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

const DeletedChatModal = ({ visible }: { visible: boolean }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(visible);
  useEffect(() => {
    setIsOpen(visible);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onRequestClose={() => {
        router.replace("/chat");
        setIsOpen(false);
      }}
      animationType="fade"
      transparent
    >
      <TouchableOpacity
        style={[
          mt.bg("blackOpacity", 800),
          mt.flex1,
          mt.justify("center"),
          mt.items("center"),
          mt.p(4),
        ]}
        onPress={() => {
          router.replace("/chat");
          setIsOpen(false);
        }}
      >
        <View
          style={[
            mt.bg("blackOpacity", 900),
            mt.p(4),
            mt.rounded("md"),
            mt.glow("md", "red"),
            mt.h("full"),
            mt.w("full"),
            mt.flexCol,
            mt.justify("center"),
            mt.items("center"),
          ]}
        >
          <Text style={[mt.color("white"), mt.fontSize("xl")]}>
            This chat has been deleted
          </Text>
          <Text style={[mt.color("red"), mt.underline, mt.fontSize("lg")]}>
            Go back to chats
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

function sanitizeMessage(message: string) {
  return message
    .slice(0, 200)
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

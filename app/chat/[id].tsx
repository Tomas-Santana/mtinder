import { Text } from "@/components/ui/text";
import { Chat, MessageType, User, darkTheme } from "@flyerhq/react-native-chat-ui";
import mt from "@/style/mtWind";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ReactNode, useState } from "react";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { Image } from "react-native";


const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

export default function Chater() {
  const { id, otherUserId, otherUserName, otherUserImage } = useLocalSearchParams<{ 
    id: string,
    otherUserId: string,
    otherUserName: string,
    otherUserImage: string
   }>();


  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const currentUser = useAtomValue(userAtom);

  const user: User = { id: currentUser?._id ?? "", firstName: currentUser?.firstName,
    imageUrl: currentUser?.imageUrls?.[0]
  };

  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages]);
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

    const imageMessage: MessageType.Image = {
      author: user,
      createdAt: Date.now(),
      height: response.height,
      id: uuidv4(),
      name: response.fileName || "image",
      size: response.fileSize ?? 0,
      type: "image",
      uri: response.uri,
      width: response.width,
    };

    addMessage(imageMessage);
  };
  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: "text",
      status: "sending",
    };
    addMessage(textMessage);
  };
  return (
    
    <View
      style={[
        mt.flexCol,
        mt.justify("flex-end"),
        mt.flex1
      ]}
    >
      {/* header */}
      <View
        style={[
          mt.flexRow,
          mt.justify("space-between"),
          mt.items("center"),
          mt.p(4),
          mt.bg("gray", 900),
          mt.w("full"),
        ]}
      >
        <View style={[mt.flexRow, mt.items("flex-start"), mt.gap(4)]}>
          <Image
            source={{ uri: otherUserImage }}
            style={[mt.w(12), mt.h(12), mt.rounded("full")]}
          />
          <Text style={[mt.color("white"), mt.fontSize("lg")]}>{otherUserName}</Text>
        </View>


      </View>
      <Chat
        enableAnimation
        renderBubble={renderBubble}
        messages={messages}
        onSendPress={handleSendPress}
        user={user}
        onAttachmentPress={handleImageSelection}
        theme={darkTheme}
      />
    </View>
  );
}

const renderBubble = ({
  child,
  message,
  nextMessageInGroup,
}: {
  child: ReactNode;
  message: MessageType.Any;
  nextMessageInGroup: boolean;
}) => {
  
  const currentUser = useAtomValue(userAtom);
  const user = { id: currentUser?._id ?? "", firstName: currentUser?.firstName,
    imageUrl: currentUser?.imageUrls?.[0]
  };
  return (
    <View
      style={{
        backgroundColor: user.id !== message.author.id ? "#ffffff" : "#1d1c21",
        borderBottomLeftRadius:
          !nextMessageInGroup && user.id !== message.author.id ? 20 : 0,
        borderBottomRightRadius:
          !nextMessageInGroup && user.id === message.author.id ? 20 : 0,
        borderColor: "#1d1c21",
        borderWidth: 1,
        overflow: "hidden",
      }}
    >
      {child}
    </View>
  );
};

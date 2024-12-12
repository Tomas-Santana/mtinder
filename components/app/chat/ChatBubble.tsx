import mt from "@/style/mtWind";
import { User } from "@/types/User";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Message } from "@/types/Message";
import { Pressable, View, ActivityIndicator, Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import mime from "mime";
import { Text } from "@/components/ui/text";
import { Modal } from "react-native";

export const ImageChatBubble = ({
  message,
  user,
  onLongPress,
}: {
  message: Message;
  user: User | null;
  onLongPress?: (messageId: string) => void
}) => {
  const isMine = message.userId === user?._id;
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        onPress={() => setIsModalVisible(true)}
        onLongPress={
          () => onLongPress && onLongPress(message._id)
        }

      >
        <View style={[mt.w(64), mt.h(64), mt.position("relative")]}>
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
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
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
      <ImageModal image={uri}
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      />
    </Animated.View>
  );
};

const ImageModal = ({ image, isVisible, setIsVisible }: { image: string, isVisible: boolean, setIsVisible: (v: boolean) => void
 }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <Animated.View
        style={[
          mt.flex1,
          mt.bg("blackOpacity", 500, 0.7),
          mt.justify("center"),
          mt.items("center"),
        ]}
      >
        <Pressable
          onPress={() => {
            setIsVisible(false);
          }}
          style={[
            mt.flex1,
            mt.w("full"),
            mt.h("full"),
            mt.justify("center"),
            mt.items("center"),
            mt.p(10),
          ]}
          

        >
          <View
            style={[
              mt.w("full"),
              mt.h("full")
            ]}
          >
            <Image
              source={{ uri: image }}
              style={[
                mt.w("full"),
                mt.h("full"),
                mt.rounded("lg"),
                { resizeMode: "contain" },
              ]}
            />
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  );

};

export const ChatBubble = ({
  message,
  user,
  onLongPress,
}: {
  message: Message;
  user: User | null;
  onLongPress?: (messageId: string) => void;

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
        onLongPress={
          () => onLongPress && onLongPress(message._id)
        }
      >
        <Text style={[mt.color("white")]}>{message.content}</Text>
        <Text
          style={[
            mt.color("white"),
            mt.fontSize("sm"),
            mt.align(isMine ? "right" : "left"),
          ]}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
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

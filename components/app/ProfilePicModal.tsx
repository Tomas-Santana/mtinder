import mt from "@/style/mtWind";
import { Modal, TouchableOpacity, View, Image } from "react-native";
import Animated from "react-native-reanimated";

export function ProfilePicModal({
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
      <Animated.View
        style={[
          mt.flex1,
          mt.bg("blackOpacity", 500, 0.7),
          mt.justify("center"),
          mt.items("center"),
        ]}
      >
        <TouchableOpacity
          onPressIn={() => setVisible(false)}
          style={[
            mt.flex1,
            mt.w("full"),
            mt.justify("center"),
            mt.items("center"),
            mt.p(10),
          ]}
        >
          <View
            style={[
              mt.w("full"),
              mt.glow(),
              mt.rounded("lg"),
              { aspectRatio: 3 / 4 },
            ]}
          >
            <Image
              source={{ uri: decodeURIComponent(profilePicture) }}
              style={[
                mt.w("full"),
                mt.h("full"),
                mt.bg("blackOpacity", 500),
                mt.rounded("lg"),
                { resizeMode: "contain" },
              ]}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

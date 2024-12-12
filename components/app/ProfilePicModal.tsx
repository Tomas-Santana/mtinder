import mt from "@/style/mtWind";
import { useState } from "react";
import { Modal, TouchableOpacity, View, Image } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export function ProfilePicModal({
  visible,
  setVisible,
  profilePicture,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  profilePicture: string[];
}) {
  const [index, setIndex] = useState(0)
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
        <PagerView
          style={[mt.flex1, mt.w("full"), mt.h("full")]}
          initialPage={index}
          orientation="horizontal"
          onPageSelected={(e) => setIndex(e.nativeEvent.position)}
        >
          {profilePicture.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{
                resizeMode: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          ))}
        </PagerView>
        <View
          style={[
            mt.flexRow,
            mt.justify("center"),
            mt.items("center"),
            mt.p(2),
          ]}
        >
          {profilePicture.map((_, i) => (
            <View
              key={i}
              style={[
                mt.w(2),
                mt.h(2),
                mt.rounded("full"),
                mt.bg("gray", i === index ? 800 : 300),
                mt.mr(1),
              ]}
            />
          ))}
        </View>
        <View style={[mt.p(4)]}>
          <Button onPress={() => setVisible(false)}>
            <Text>Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

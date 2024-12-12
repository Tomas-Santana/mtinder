import mt from "@/style/mtWind";
import { Modal, TouchableOpacity, View, Image } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function ProfilePicModal({
  visible,
  setVisible,
  profilePicture,
  currentIndex,
  setCurrentIndex,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  profilePicture: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
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
          <PagerView 
            style={[
              mt.p(2),
              mt.justify("center"),
              mt.items("center"),
              mt.flex1,
              mt.w("full"),
              mt.border(2),
            ]}
            initialPage={0}
            collapsable={false}
            orientation={"horizontal"}
            onPageSelected={(event) => {
              setCurrentIndex(event.nativeEvent.position);
            }}
          >
            {profilePicture.map((picture) => {
              return (
                <Animated.View key={picture} style={[
                  mt.w(72),
                  mt.h(72),
                  mt.m(2),
                  mt.flex1,
                  mt.position("relative"),
                  mt.items("center"),
                  mt.rounded("md"),
                  mt.justify("center"),
                  mt.glow("sm"),
                  mt.gap(2),
                ]}>
                  <Image
                    source={{ uri: picture }}
                    style={[
                      { resizeMode: "cover" },
                      mt.flex1,
                      mt.w("full"),
                      mt.rounded("md"),
                    ]}
                  />
                </Animated.View>
              );
            })}
          </PagerView>
          {profilePicture.length > 0 && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[
                mt.flexRow,
                mt.justify("center"),
                mt.items("center"),
                mt.h(4),
                mt.gap(2),
              ]}
            >
              {profilePicture.map((_, index) => (
                <View
                  key={index}
                  style={[
                    mt.w(4),
                    mt.h(4),
                    mt.rounded("full"),
                    mt.bg(index === currentIndex ? "white" : "gray"),
                  ]}
                ></View>
              ))}
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
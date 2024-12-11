import React, { useRef } from "react";
import { View, PanResponder } from "react-native";
import mt from "@/style/mtWind";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../ui/text";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface SwipeableProps {
  children: React.ReactNode;
  onSwipeAction: () => void;
  entering?: any;
  exiting?: any;
}

export const Swipeable = ({
  children,
  onSwipeAction,
  entering = FadeIn,
  exiting = FadeOut,
}: SwipeableProps) => {
  const translateX = useSharedValue(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (e, gestureState) => {
      const newTranslateX = Math.max(0, gestureState.dx);
      translateX.value = newTranslateX;
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > 100) {
        onSwipeAction();
        translateX.value = withTiming(500, { duration: 300 });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View
      style={[mt.position("relative")]}
      layout={LinearTransition}
      entering={entering}
      exiting={exiting}
    >
      <Animated.View
        style={[
          mt.position("absolute"),
          mt.bg("red", 500),
          mt.flexCol,
          mt.justify("center"),
          mt.items("center"),
          mt.left(0),
          mt.z(-1),
          mt.h("full"),
          mt.w("full"),
        ]}
        layout={LinearTransition}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color={"black"}
        />
        <Text style={[mt.align("center")]}>Delete chat</Text>
      </Animated.View>
      <Animated.View style={[animatedStyle]} {...panResponder.panHandlers}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};

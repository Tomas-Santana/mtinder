import mt from "@/style/mtWind";
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from "react-native-reanimated";
import { useEffect } from "react";

export default function Logo() {
  const opacity = useSharedValue(0.5);



  opacity.value = opacity.value = withRepeat(
    withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    }),
    -1,
    true
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, [opacity]);

  return (
    <Animated.Image
      source={require("../../assets/images/mmlogo.png")}
      style={[mt.w(56), mt.pxh(150), animatedStyle]}
    />
  );
}
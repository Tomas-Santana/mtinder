import { Animated, StyleProp, ViewStyle } from "react-native";
import React, { useEffect, useRef } from "react";
import mt, {MTTypes, handleColor} from "@/style/mtWind";
import s from "@/style/styleValues";

interface GlowProps {
  children: React.ReactNode;
  color?: string;
  mtColor?: MTTypes["Color"];
  glowing?: boolean;
  isRounded?: boolean;
  viewStyles?: StyleProp<ViewStyle>;
}

export function Glow({ children, color, glowing }: GlowProps) {
  const glow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  }, [glow]);

  return (
    <Animated.View
      style={glowing && { boxShadow: `0 0 5 4 ${color}`, opacity: glow }}
    >
      {children}
    </Animated.View>
  );
}

export function NeonGlow({ children, color, mtColor, viewStyles }: GlowProps) {
  const neonLight = useRef(new Animated.Value(1));

  const glowColor = mtColor ? handleColor(mtColor) : color;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(neonLight.current, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(neonLight.current, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(neonLight.current, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  }, [neonLight]);

  return (
    <Animated.View
      style={[
        { boxShadow: `0 0 5 4 ${glowColor}`, opacity: neonLight.current },
        mt.shadowRadius("base"),
        viewStyles,
      ]}
    >
      {children}
    </Animated.View>
  );
}

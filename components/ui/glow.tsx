import { Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import mt from "@/style/mtWind";

interface GlowProps {
  children: React.ReactNode
  color?: string
  glowing?: boolean
  isRounded?: boolean
}

export function Glow({ children, color, glowing }: GlowProps){
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
    <Animated.View style={glowing && { boxShadow: `0 0 5 4 ${color}`, opacity: glow }}>
      {children}
    </Animated.View>
  )
}

export function NeonGlow({ children, color }: GlowProps) {
  const neonLight = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(neonLight, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(neonLight, {
          toValue: 0.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(neonLight, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start()
  }, [neonLight])

  return (
    <Animated.View style={[{ boxShadow: `0 0 5 4 ${color}`, opacity: neonLight }, mt.shadowRadius("base")]}>
      {children}
    </Animated.View>
  )

}
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  ActivityIndicator,
  Pressable,
} from "react-native";
import s, { ColorShade } from "@/style/styleValues";
import React, { useState } from "react";
import { Glow } from "./glow";
import mt, { MTTypes } from "@/style/mtWind";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "danger" | "success";
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  color?: MTTypes["Color"]
  children: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ ...props }: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <Glow glowing={pressed}>
      <View>
        <TouchableOpacity
          style={[
            buttonStyles(props.variant, props.disabled ?? false),
            props.style,
          ]}
          {...props}
          onPressIn={(e) => {
            setPressed(true);
            props.onPressIn?.(e);
          }}
          onPressOut={(e) => {
            setPressed(false);
            props.onPressOut?.(e);
          }}
        >
          {props.loading ? (
            <ActivityIndicator size="small" color={s.colors.white} />
          ) : (
            props.children
          )}
        </TouchableOpacity>
      </View>
    </Glow>
  );
}

interface CPushButtonProps extends ButtonProps {
  isPushed: boolean;
}

export function CPushButton({ isPushed, ...props } : CPushButtonProps) {
  const pressedStyle = useAnimatedStyle(() => {
    // background color and text color

    return {
      backgroundColor: withTiming(isPushed ? s.colors.blue[500] : s.colors.white),
    }
  }, [isPushed]);

  return (
    <AnimatedPressable
      style={[
        buttonStyles(props.variant, props.disabled ?? false),
        props.style,
        pressedStyle
      ]}
      {...props}
    >
      {props.children}
    </AnimatedPressable>
  );

}

export function CoolButton({ ...props }: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <View style={[mt.glow("sm", props.color)]}>
      <TouchableOpacity
        style={[mt.rounded("md"), mt.bg("black"), props.style]}
        {...props}
        onPressIn={(e) => {
          setPressed(true);
          props.onPressIn?.(e);
        }}
        onPressOut={(e) => {
          setPressed(false);
          props.onPressOut?.(e);
        }}
      >
        {props.loading ? (
          <ActivityIndicator size={20} color={"white"} style={[mt.color(props.color ?? "white")]} />
        ): (
          props.children
        )}
        
      </TouchableOpacity>
    </View>
  );
}

const buttonStyles = (
  variant: ButtonProps["variant"],
  disabled: boolean = false
) => {
  const disabledBg: [MTTypes["Color"], ColorShade, number?] = ["whiteOpacity", 500, 0.5];
  let backgroundColor: [MTTypes["Color"], ColorShade?, number?] = disabled
    ? ["whiteOpacity", 500, 0.5]
    : ["blue"];
  let textColor: string = "white";

  switch (variant) {
    case "secondary":
      backgroundColor = disabled ? disabledBg : ["orange"];
      break;
    case "danger":
      backgroundColor = disabled ? disabledBg : ["red"];
      break;
    case "success":
      backgroundColor = disabled ? disabledBg : ["green"];
      break;
  }

  const glowColor = disabled ? "transparent" : variant === "primary" ? "blue" : variant === "secondary" ? "orange" : variant === "danger" ? "red" : variant === "success" ? "green" : "blue";

  const mtSheet = [
    mt.p(2),
    mt.px(4),
    mt.border(2),
    mt.borderColor(backgroundColor[0], 200, 1),
    mt.rounded("md"),
    mt.bg(
      backgroundColor[0],
      backgroundColor[1],
      backgroundColor[2]
    ),
    // mt.glow("sm", glowColor),
    mt.flex,
    mt.justify("center"),
    mt.items("center"),
  ];

  return mtSheet;
};

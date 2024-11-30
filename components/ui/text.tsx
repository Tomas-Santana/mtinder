import { Text as MTText, TextProps } from "react-native";
import mt, { MTTypes } from "@/style/mtWind";
import { Glow } from "./glow";

interface CustomTextProps extends TextProps {
  weight?: "bold" | "black" | "normal";
  size?: MTTypes["FontSize"];
  color?: string;
}

export function Text({
  weight = "normal",
  size = "md",
  ...props
}: CustomTextProps) {
  return (
    <MTText
      {...props}
      style={[mt.fontWeight(weight), mt.fontSize(size), props.style]}
    />
  );
}

export function GlowingText({
  weight = "bold",
  size = "md",
  color,
  ...props
}: CustomTextProps) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          textShadowColor: color,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        },
      ]}
    />
  );
}

import { Text as MTText, TextProps } from "react-native";
import mt, { MTTypes } from "@/style/mtWind";

interface CustomTextProps extends TextProps {
  weight?: "bold" | "black" | "normal",
  size?: MTTypes["FontSize"]
}

export function Text({ weight="normal", size="md", ...props }: CustomTextProps) {
  return (
    <MTText {...props} style={[mt.fontWeight(weight), mt.fontSize(size), props.style]}/>   
  )
}
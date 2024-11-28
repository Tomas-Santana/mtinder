import { TouchableOpacity, TouchableOpacityProps, StyleSheet, StyleProp, View, ViewStyle, ActivityIndicator } from "react-native";
import s from "@/style/styleValues";
import React, { useState } from "react";
import { Glow } from "./glow";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "danger" | "success"
  style?: StyleProp<ViewStyle>
  loading?: boolean
  children: React.ReactNode
}

export function Button({ ...props }: ButtonProps){
  const [pressed, setPressed] = useState(false)
  return (
    <Glow glowing={pressed}>
      <View>
        <TouchableOpacity
          style={[
            buttonStyles(props.variant, props.disabled ?? false).button,
            props.style
          ]}
          {...props}
          onPressIn={(e) => {
            setPressed(true)
            props.onPressIn?.(e)
          }}
          onPressOut={(e) => {
            setPressed(false)
            props.onPressOut?.(e)
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
  )
}

const buttonStyles = (variant: ButtonProps["variant"], disabled: boolean = false) => {
  let backgroundColor: string = disabled ? s.colors.transparent : s.colors.blue[500]
  let textColor: string = s.colors.white

  switch(variant) {
    case "secondary":
      backgroundColor = disabled ? s.colors.transparent : s.colors.orange[500]
      textColor = s.colors.black
      break
    case "danger":
      backgroundColor = disabled? s.colors.transparent : s.colors.red[500]
      textColor = s.colors.white
      break
    case "success":
      backgroundColor = disabled? s.colors.transparent : s.colors.green[500]
      textColor = s.colors.white
      break
  }

  return StyleSheet.create({
    button: {
      paddingVertical: s.pixels[2],
      borderWidth: s.borderWidth[2],
      borderColor: s.colors.black,
      borderRadius: s.borderRadius.none,
      color: textColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: s.pixels[2],
      backgroundColor: backgroundColor,
    }
  })
}
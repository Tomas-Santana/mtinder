import { TextInput as Input } from "react-native";
import { Controller } from "react-hook-form";
import type { Control, FieldError } from "react-hook-form";
import Animated, {
  AnimatedStyle,
  LinearTransition,
} from "react-native-reanimated";
import { FormError } from "./formError";
import { FormLabel } from "./formLabel";
import { StyleProp } from "react-native";
import { TextStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import React, { Ref, useState } from "react";
import { formStyles } from "@/style/formStyle";
import s from "@/style/styleValues";
import mt from "@/style/mtWind";
import { ViewStyle } from "react-native";
import { Glow } from "../../ui/glow";

interface FormTextInputFormProps {
  placeholder?: string;
  label?: string;
  name: string;
  control: Control<any>;
  type?: "text" | "password";
  error?: FieldError;
  inputStyle?: StyleProp<TextStyle>;
  viewStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  inputRef?: Ref<TextInput>;
  autofocus?: boolean;
}

export function FormTextInput({
  placeholder,
  label,
  name,
  control,
  type = "text",
  error,
  inputStyle,
  viewStyle,
  inputRef,
  autofocus,
}: FormTextInputFormProps) {
  const [focus, setFocus] = useState(false);

  return (
    <Animated.View
      layout={LinearTransition}
      style={[mt.flexCol, mt.gap(3), viewStyle]}
    >
      {label && <FormLabel label={label} />}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Glow glowing={focus ? true : false} color="#39DBFF">
            <Input
              style={[
                formStyles.input,
                mt.bg("gray", 700),
                mt.h(10),
                mt.p(2),
                mt.border(2),
                mt.color("white"),
                inputStyle,
              ]}
              placeholder={placeholder}
              selectionColor={"#fff"}
              placeholderTextColor={"#fff"}
              onBlur={() => {
                setFocus(false);
                onBlur();
              }}
              onFocus={() => setFocus(true)}
              onChangeText={onChange}
              value={value}
              secureTextEntry={type === "password"}
              maxLength={100}
            />
          </Glow>
        )}
      />
      {error && <FormError error={error} />}
    </Animated.View>
  );
}

export function UnstyledFormTextInput({
  placeholder,
  label,
  name,
  control,
  type = "text",
  error,
  autofocus,
}: FormTextInputFormProps) {
  const [focus, setFocus] = useState(false);

  return (
    <Animated.View layout={LinearTransition} style={[mt.flexCol, mt.gap(4)]}>
      {label && <FormLabel label={label} />}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Glow glowing={focus}>
            <Input
              style={[formStyles.input]}
              placeholder={placeholder}
              placeholderTextColor={"#fff"}
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                setFocus(false);
                onBlur();
              }}
              onFocus={() => setFocus(true)}
              secureTextEntry={type === "password"}
              autoFocus={autofocus}
              maxLength={100}
            />
          </Glow>
        )}
      />
      {error && <FormError error={error} />}
    </Animated.View>
  );
}

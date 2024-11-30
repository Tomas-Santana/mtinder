import { View, TextInput, Button, Animated } from "react-native";
import mt from "@/style/mtWind";
import { useState } from "react";
import { Glow, NeonGlow } from "@/components/ui/glow";
import { GlowingText, Text } from "@/components/ui/text";
import LoginForm from "@/components/forms/loginForm";
import DropDown from "@/components/ui/dropDown";

const options = [
  { label: "Masculino", value: "male" },
  { label: "Femenino", value: "female" },
  { label: "Otro", value: "other" },
];

export default function Login() {
  return (
    <View style={[mt.flexCol, mt.gap(4), mt.p(4), mt.pt(10), mt.w("full")]}>
      <View style={[mt.flexCol, mt.gap(2), mt.items("center")]}>
        <NeonGlow color="#FFB443">
          <View style={[mt.p(5)]}>
            <GlowingText
              style={[mt.fontSize("2xl"), mt.color("blue"), mt.spacing(2)]}
              color="#39DBFF"
            >
              Linker
            </GlowingText>
          </View>
        </NeonGlow>
        <GlowingText
          style={[mt.fontSize("lg"), mt.color("blue")]}
          color="#80E1FF"
        >
          Iniciar Sesion
        </GlowingText>
        <Text style={[mt.color("white")]}>Conecta con personas!</Text>
      </View>
      <LoginForm />
      <View
        style={[mt.h(10), mt.w(10), mt.glow()]}
      ></View>
      <DropDown
        data={options}
        onChange={console.log}
        placeholder="Selecciona un genero"
      />
    </View>
  );
}

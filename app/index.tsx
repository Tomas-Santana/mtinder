import { View, TextInput, Button, Animated, Image } from "react-native";
import mt from "@/style/mtWind";
import { useState } from "react";
import { NeonGlow } from "@/components/ui/glow";
import { GlowingText, Text } from "@/components/ui/text";
import LoginForm from "@/components/forms/loginForm";
import DropDown from "@/components/ui/dropDown";
import Logo from "@/components/app/Logo";
// import Logo from "../assets/images/mellow-mates-logo.svg"

export default function Login() {
  return (
    <View style={[mt.flexCol, mt.gap(4), mt.p(4), mt.pt(10), mt.w("full")]}>
      <View style={[mt.flexCol, mt.gap(2), mt.items("center")]}>
        
          <Image 
            source={require("../assets/images/logo.png")}
            style={[mt.w(56), mt.h(40), ]}
          />
        <GlowingText
          style={[mt.fontSize("lg"), mt.color("blue")]}
          color="#80E1FF"
        >
          Log in
        </GlowingText>
        <Text style={[mt.color("white")]}>
          Log in to your account and find your next best mate.
        </Text>
      </View>
      <View style={[mt.rounded("md"), mt.border(2), mt.p(4), mt.borderColor("gray", 400), mt.glow("md", "blue")]}>
        <LoginForm />
      </View>
    </View>
  );
}

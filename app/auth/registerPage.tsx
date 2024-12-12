import { View } from "react-native";
import { GlowingText, Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import { NeonGlow } from "@/components/ui/glow";
import RegisterForm from "@/components/forms/registerForms/registerForm";
import Logo from "@/components/app/Logo";

export default function Register(){
  return (
    <View
      style={[mt.flexCol, mt.items("center"), mt.gap(4), mt.p(5), mt.w("full")]}
    >
      <View style={[mt.flexCol, mt.gap(3), mt.items("center")]}>
        <Logo />
        <GlowingText style={[mt.fontSize("lg"), mt.color("orange", 600), mt.align("center")]} color="#FFA500">
          Create Account
        </GlowingText>
        <Text style={[mt.fontSize("md"), mt.color("gray"), mt.spacing(1)]}>
          Create an account and find your next best mate.
        </Text>
      </View>
      <View style={[mt.rounded("md"), mt.border(2), mt.borderColor("gray", 400), mt.glow("md", "orange", 600), mt.p(4)]}>
        <RegisterForm />
      </View>
    </View>
  );
}
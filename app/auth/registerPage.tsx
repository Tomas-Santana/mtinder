import { View } from "react-native";
import { GlowingText, Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import { NeonGlow } from "@/components/ui/glow";
import RegisterForm from "@/components/forms/registerForms/registerForm";
import Logo from "@/components/app/Logo";

export default function SendReset(){
  return (
    <View
      style={[mt.flexCol, mt.items("center"), mt.gap(4), mt.p(5), mt.w("full")]}
    >
      <View style={[mt.flexCol, mt.gap(3), mt.items("center")]}>
        <Logo />
        <GlowingText style={[mt.fontSize("lg"), mt.color("blue"), mt.align("center")]} color="#80E1FF">
          Registrate
        </GlowingText>
        <Text style={[mt.fontSize("md"), mt.color("gray"), mt.spacing(1)]}>
          Crea una cuenta para comenzar a interactuar con la gente 
        </Text>
      </View>
      <View style={[mt.rounded("md"), mt.border(2), mt.borderColor("gray", 400), mt.glow("md", "blue"), mt.p(4), mt.mt(10)]}>
        <RegisterForm />
      </View>
    </View>
  );
}
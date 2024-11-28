import { View } from "react-native";
import { GlowingText, Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import ChangePasswordForm from "@/components/forms/changePasswordForms/changePasswordForm";
import { NeonGlow } from "@/components/ui/glow";

export default function ChangePasswordPage(){
  return (
    <View
      style={[mt.flexCol, mt.items("center"), mt.gap(4), mt.p(5), mt.w("full")]}
    >
      <View style={[mt.flexCol, mt.gap(3), mt.items("center")]}>
        <NeonGlow color="#80E1FF">
          <View style={[mt.p(5)]}>
            <GlowingText
              style={[mt.fontSize("2xl"), mt.color("blue"), mt.spacing(2)]}
              color="#39DBFF"
            >
              Linker
            </GlowingText>
          </View>
        </NeonGlow>
        <Text style={[mt.fontSize("md"), mt.color("gray"), mt.spacing(1)]}>
          Recupera tu contraseña para seguir interactuando!
        </Text>
      </View>
      <ChangePasswordForm />
    </View>
  );
}
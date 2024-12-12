import { View } from "react-native";
import { GlowingText, Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import SendResetForm from "@/components/forms/changePasswordForms/sendResetForm";
import { NeonGlow } from "@/components/ui/glow";
import Logo from "@/components/app/Logo";

export default function SendReset() {
  return (
    <View
      style={[mt.flexCol, mt.items("center"), mt.gap(4), mt.p(5), mt.w("full")]}
    >
      <View style={[mt.flexCol, mt.gap(3), mt.items("center")]}>
        <Logo />
        <Text style={[mt.fontSize("md"), mt.color("gray"), mt.spacing(1)]}>
          Enter your email so you can change your password!
        </Text>
      </View>
      <View style={[mt.rounded("md"), mt.border(2), mt.borderColor("gray", 400), mt.glow("md", "yellow", 600), mt.p(4), mt.mt(10)]}>
        <SendResetForm />
      </View>
    </View>
  );
}

import { SimpleNavbar } from "@/components/app/simpleNavbar";
import mt from "@/style/mtWind";
import Animated, { SlideInRight, SlideOutLeft, LinearTransition } from "react-native-reanimated";
import { View } from "react-native";
import { GlowingText, Text } from "@/components/ui/text";
import UserForm from "@/components/forms/updateUserForm";
import { VerticalTabs, Tab } from "@/components/ui/tabs";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtom } from "jotai";

export default function UpdateInfoScreen() {
  return (
    <View style={[mt.flex1]}>
      <View style={[mt.position("absolute"), mt.top(5), mt.left(5)]}>
        <SimpleNavbar/>
      </View>
      <View style={[mt.flex1, mt.justify("center"), mt.items("center"), mt.p(4)]}>
        <View style={[mt.flexCol, mt.justify("center"), mt.gap(4), mt.rounded("md"), mt.border(2), mt.borderColor("gray", 200), mt.glow("md", "blue"), mt.p(6)]}>
          <GlowingText style={[mt.fontSize("2xl"), mt.align("center"), mt.color("blue")]} color="#80E1FF">
            Tus datos personales
          </GlowingText>
          <Text style={[mt.fontSize("md"), mt.align("center"), mt.color("gray")]}>
            Actualiza tus datos personales para ver información más precisa en tu app.
          </Text>
          <View style={[mt.mt(10)]}>
            <UserForm />
          </View>
        </View>
      </View>
    </View>
  )
}

const PersonalInfoTab
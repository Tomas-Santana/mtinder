import { View, TextInput, Button, Animated } from "react-native";
import mt from "@/style/mtWind";
import { useState } from "react";
import { Glow, NeonGlow } from "@/components/ui/glow";
import { Text } from "@/components/ui/text";
import LoginForm from "@/components/forms/loginForm";

export default function Login() {
  
  const [focus, setFocus] = useState(false);

  return (
    <View style={[mt.flexCol, mt.gap(4), mt.p(4), mt.pt(10), mt.w("full")]}>
      <View style={[mt.flexCol, mt.gap(2), mt.items("center")]}>
        <NeonGlow color="#FFB443">
          <View style={[mt.p(5), mt.border(4), mt.borderColor("orange")]}>
            <Text style={[mt.fontSize("2xl"), mt.color("blue"), { textShadowColor: '#39DBFF', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10, fontWeight: "bold", }, mt.spacing(2)]}>Linker</Text>
          </View>
        </NeonGlow>
        <Text style={[mt.fontSize("sm"), mt.color("white")]}>
          Conecta con tus amigos
        </Text>
      </View>

      <LoginForm />
    </View>
  );
}

import { View } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";

export default function SendReset(){
  return(
    <View>
      <Text style={[mt.color("white")]}>Enviando correo de recuperación</Text>
    </View>
  )
}
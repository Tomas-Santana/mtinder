import { Modal, View } from "react-native";
import UserForm from "./forms/updateUserForm";
import mt from "@/style/mtWind";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export function UpdateModal(){

  const [visible, setVisible] = useState(false)

  const close = () => {
    setVisible(false)
  }

  return (
    <View style={[mt.flexCol, mt.items("center"), mt.gap(9), mt.p(5), mt.w("full")]}>
      <Button variant="secondary" style={[mt.flexRow, mt.gap(2)]} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="account-edit" size={24} color="white" style={[mt.textGlow("md", "white")]}/>
        <Text style={[mt.color("white")]}>Editar Perfil</Text>
      </Button>
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={[mt.flex1, mt.justify("center"), mt.items("center") ]}>
          <View style={[mt.position("absolute"), mt.p(4), mt.w("full"), mt.maxW(96)]}>
            <UserForm onClose={close} />
          </View>
        </View>
      </Modal>
    </View>
  )
}
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import UserForm from "../forms/updateUserForm";
import mt from "@/style/mtWind";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export function UpdateModal() {
  const [visible, setVisible] = useState(false);

  const close = () => {
    setVisible(false);
  };

  return (
    <View
      style={[mt.flexCol, mt.items("center"), mt.gap(9), mt.p(5), mt.w("full")]}
    >
      <Button
        style={[mt.flexRow, mt.gap(2), mt.borderColor("blue"), mt.border(2), mt.p(3), mt.rounded("base")]}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons
          name="account-edit-outline"
          size={24}
          color="#80E1FF"
          style={[mt.textGlow("md", "blue")]}
        />
        <Text style={[mt.color("white")]}>Editar Perfil</Text>
      </Button>
      <Modal visible={visible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={close}>
          <View style={[mt.flex1, mt.justify("center"), mt.items("center")]}>
            <View
              style={[
                mt.position("absolute"),
                mt.p(4),
                mt.maxW(96),
                mt.border(2),
                mt.borderColor("white"),
                mt.glow("sm", "white"),
              ]}
            >
              <TouchableOpacity
                onPress={close}
                style={[
                  mt.position("absolute"),
                  mt.top(5),
                  mt.right(5),
                  mt.glow("sm", "red"),
                ]}
              >
                <MaterialCommunityIcons name="close" color="red" size={24} />
              </TouchableOpacity>
              <UserForm onClose={close} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

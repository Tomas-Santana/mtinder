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
import { GlowingText, Text } from "../ui/text";
import { useAtom } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { useMutation } from "@tanstack/react-query";
import UserController from "@/api/controllers/UserController";
import { router } from "expo-router";

export function DeleteModal() {
  const [currentUser, setUser] = useAtom(userAtom);

  const [visible, setVisible] = useState(false);

  const close = () => {
    setVisible(false);
  };

  const deleteMutation = useMutation({
    mutationFn: UserController.DeleteUser,
    onSuccess: () => {
      console.log("Cuenta eliminada");
      setUser(null);
      router.push("/");
    },
    onError: (error) => {
      console.log("Error al eliminar la cuenta", error);
    },
  });

  const deleteUser = () => {
    if (currentUser) deleteMutation.mutate({ _id: currentUser._id });
    setVisible(false);
  };

  return (
    <View
      style={[mt.flexCol, mt.items("center"), mt.gap(9), mt.p(5), mt.w("full")]}
    >
      <Button
        variant="secondary"
        style={[mt.flexRow, mt.gap(2)]}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons
          name="account-edit"
          size={24}
          color="white"
          style={[mt.textGlow("md", "white")]}
        />
        <Text style={[mt.color("white")]}>Borrar Cuenta</Text>
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
              <View
                style={[
                  mt.flexCol,
                  mt.gap(5),
                  mt.items("center"),
                  mt.justify("center"),
                ]}
              >
                <GlowingText
                  style={[
                    mt.fontSize("2xl"),
                    mt.color("red"),
                    mt.align("center"),
                  ]}
                  color="#FF0000"
                >
                  Borrar tu cuenta
                </GlowingText>
                <Text style={[mt.color("red"), mt.align("center")]}>
                  Estás a punto de borrar tu cuenta y todos tus datos
                  personales. No podrás recuperarlos una vez borrados. ¿Estás
                  seguro de querer continuar?
                </Text>
              </View>

              <Button variant="danger" onPress={deleteUser} style={[mt.flexRow, mt.gap(2), mt.borderColor("red"), mt.border(2), mt.p(3), mt.rounded("base")]}>
                <Text style={[mt.color("white")]}>
                  Borrar cuenta
                </Text>
                <MaterialCommunityIcons
                  name="account-cancel-outline"
                  size={24}
                  color="#ff0000"
                  style={[mt.textGlow("md", "red"), mt.ml(2)]}
                />
              </Button>

              <Button variant="secondary" style={[mt.mt(4)]} onPress={close}>
                <Text>
                  Cancelar
                </Text>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

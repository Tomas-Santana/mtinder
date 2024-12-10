import { View } from "react-native";
import mt from "@/style/mtWind";
import { SimpleNavbar } from "@/components/app/simpleNavbar";
import { UpdateModal } from "@/components/app/updateUserModal";
import { DeleteModal } from "@/components/app/deleteUserModal";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import AuthController from "@/api/controllers/AuthController";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Settings() {

  const [currentUser, setUser] = useAtom(userAtom)
  const queryClient = useQueryClient()

  const logOut = async () => {
    queryClient.clear();
    await AuthController.logout()
    router.push("/")
  }

  return (
    <View style={[mt.flex1]}>
      <View style={[mt.position("absolute"), mt.top(0), mt.left(0), mt.z(2)]}>
        <SimpleNavbar />
      </View>
      <View style={[mt.flex1, mt.items("center"), mt.justify("center")]}>
        <View style={[mt.flexCol, mt.gap(2), mt.items("center")]}>
          <Text style={[mt.fontSize("lg"), mt.align("center"), mt.color("white")]}>
            {currentUser?.firstName} {currentUser?.lastName}
          </Text>
          <Text style={[mt.fontSize("sm"), mt.align("center"), mt.color("gray")]}>
            {currentUser?.email}
          </Text>
        </View>
        <UpdateModal />
        <Button style={[mt.flexRow, mt.gap(2)]} onPress={logOut}>
          <Text style={[ mt.color("white") ]}>
            Cerrar sesion
          </Text>
          <MaterialCommunityIcons name="logout" size={24} color={"white"}/>
        </Button>
        <DeleteModal />
      </View>
    </View>
  );
}

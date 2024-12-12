import { Image, TouchableOpacity, View } from "react-native";
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
import { useState } from "react";
import { UpdateProfilePic } from "@/components/app/updateProfilePicture";

export default function Settings() {
  const [currentUser, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  const logOut = async () => {
    queryClient.clear();
    await AuthController.logout();
    router.push("/");
  };

  return (
    <View style={[mt.flex1]}>
      <View style={[mt.position("absolute"), mt.top(0), mt.left(0), mt.z(2)]}>
        <SimpleNavbar />
      </View>
      <View style={[mt.flex1, mt.items("center"), mt.justify("center")]}>
        <View style={[mt.flexCol, mt.gap(2), mt.items("center")]}>
          <View style={[mt.pb(3)]}>
            <Image
              source={{ uri: currentUser?.imageUrls?.[0] || undefined }}
              style={[
                mt.w(32),
                mt.h(32),
                mt.rounded("full"),
                mt.resize("cover"),
              ]}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}
                style={[mt.bg("gray", 900), mt.rounded("full"), mt.p(2), mt.position("absolute"), mt.right(0), mt.bottom(0), mt.glow("sm")]}
              >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </View>
          {/* <View
            style={[mt.pxh(1), mt.w("full"), mt.glow("sm"), mt.bg("blue", 300)]}
          ></View> */}
          <UpdateProfilePic
            visible={modalVisible}
            setVisible={setModalVisible}
          />
          <Text
            style={[mt.fontSize("lg"), mt.align("center"), mt.color("white")]}
          >
            {currentUser?.firstName} {currentUser?.lastName}
          </Text>
          <Text
            style={[mt.fontSize("md"), mt.align("center"), mt.color("gray")]}
          >
            {currentUser?.email}
          </Text>
        </View>
        <View style={[mt.flexCol, mt.gap(6), mt.justify("center"), mt.items("center"), mt.p(2)]}></View>
        <Button 
          style={[mt.flexRow, mt.gap(2), mt.borderColor("blue"), mt.border(2), mt.p(3), mt.rounded("sm"), mt.glow("sm", "blue"), mt.mb(5)]} 
          onPress={() => router.push("/profile/edit")}
        >
          <MaterialCommunityIcons name="account-edit-outline" size={24} color="#80E1FF" style={[mt.textGlow("sm", "blue")]} />
          <Text style={[mt.color("blue")]}>Editar Perfil</Text>
        </Button>
        <Button style={[mt.flexRow, mt.gap(2), mt.borderColor("orange"), mt.border(2), mt.p(3), mt.rounded("sm"), mt.glow("sm", "orange")]} onPress={logOut}>
          <MaterialCommunityIcons name="logout" size={24} color={"orange"} style={[mt.textGlow("sm", "orange")]}/>
          <Text style={[mt.color("orange")]}>Cerrar sesion</Text>
        </Button>
        <DeleteModal />
      </View>
    </View>
  );
}

import { Image, Modal, TouchableOpacity, View } from "react-native";
import mt from "@/style/mtWind";
import { SimpleNavbar } from "@/components/app/simpleNavbar";
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
import PagerView from "react-native-pager-view";
import { DropdownWithOptions } from "@/components/ui/DropdownWithOptions";
import { useMutateProfilePic } from "@/hooks/useDeleteProfilePic";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useAddProfilePic } from "@/hooks/useAddProfilePic";
import { ActivityIndicator } from "react-native";

export default function Settings() {
  const [currentUser, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  const logOut = async () => {
    queryClient.clear();
    await AuthController.logout();
    router.push("/");
  };

  const addMutation = useAddProfilePic();

  const addProfilePic = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [3, 4],
      selectionLimit: 1,
      quality: 1,
      allowsEditing: true,
      base64: true,
    });
    if (result.canceled || !result.assets[0].base64) return;

    addMutation.mutate({
      encodedImage: result.assets[0].base64,
    });
  };

  return (
    <View style={[mt.flex1]}>
      <View style={[mt.position("absolute"), mt.top(0), mt.left(0), mt.z(2)]}>
        <SimpleNavbar />
      </View>
      <View style={[mt.flex1, mt.items("center"), mt.justify("center")]}>
        <View style={[mt.flexCol, mt.gap(2), mt.items("center")]}>
          <View style={[mt.pb(3)]}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={[
                mt.position("relative"),
                mt.opacity(addMutation.isPending ? 0.5 : 1),
              ]}
            >
              <Image
                source={{ uri: currentUser?.imageUrls?.[0] || undefined }}
                style={[
                  mt.w(32),
                  mt.h(32),
                  mt.rounded("full"),
                  mt.resize("cover"),
                ]}
              />
              {/* loader when addMutation is pending */}
              {addMutation.isPending && (
                <View
                  style={[
                    mt.bg("black", 700, 0.5),
                    mt.rounded("full"),
                    mt.p(2),
                    mt.position("absolute"),
                    mt.top(0),
                    mt.left(0),
                    mt.items("center"),
                    mt.justify("center"),
                  ]}
                >
                  <ActivityIndicator size="small" color="white" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addProfilePic}
              style={[
                mt.bg("gray", 900),
                mt.rounded("full"),
                mt.p(3),
                mt.position("absolute"),
                mt.right(0),
                mt.bottom(0),
                mt.glow("sm"),
              ]}
            >
              <MaterialCommunityIcons
                // camera plus
                name="camera-plus-outline"
                size={24}
                color={"white"}
                style={[mt.textGlow("sm")]}
              />
            </TouchableOpacity>
          </View>

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
        <View
          style={[
            mt.flexCol,
            mt.gap(6),
            mt.justify("center"),
            mt.items("center"),
            mt.p(2),
          ]}
        ></View>
        <Button
          style={[
            mt.flexRow,
            mt.gap(2),
            mt.borderColor("blue"),
            mt.border(2),
            mt.p(3),
            mt.rounded("sm"),
            mt.glow("sm", "blue"),
            mt.mb(5),
          ]}
          onPress={() => router.push("/profile/edit")}
        >
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={24}
            color="#80E1FF"
            style={[mt.textGlow("sm", "blue")]}
          />
          <Text style={[mt.color("blue")]}>Edit Profile</Text>
        </Button>
        <Button
          style={[
            mt.flexRow,
            mt.gap(2),
            mt.borderColor("orange"),
            mt.border(2),
            mt.p(3),
            mt.rounded("sm"),
            mt.glow("sm", "orange"),
          ]}
          onPress={logOut}
        >
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color={"orange"}
            style={[mt.textGlow("sm", "orange")]}
          />
          <Text style={[mt.color("orange")]}>Log Out</Text>
        </Button>
        <DeleteModal />
      </View>
      <ImageModal
        visible={modalVisible}
        setVisible={setModalVisible}
        images={currentUser?.imageUrls || []}
      />
    </View>
  );
}

const ImageModal = ({
  visible,
  setVisible,
  images,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  images: string[];
}) => {
  const [index, setIndex] = useState(0);
  const {
    deleteMutation,
    principalMutation,
  } = useMutateProfilePic();

  const options = ["Set as main","Delete Picture"];
  const onSelect = (option: string) => {
    if (option === "Delete Picture") {
      deleteMutation.mutate({ url: images[index] });
      setIndex(0);
    }
    if (option === "Set as main") {
      principalMutation.mutate({ index });
      setVisible(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View
        style={[
          mt.flex1,
          mt.bg("black", 900, 0.5),
          mt.justify("center"),
          mt.items("center"),
        ]}
      >
        <View
          style={[
            mt.flexRow,
            mt.justify("flex-end"),
            mt.items("center"),
            mt.p(2),
            mt.w("full"),
            mt.pt(4),
          ]}
        >
          <DropdownWithOptions
            options={options}
            onSelect={onSelect}
            position="br"
            trigger={
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={"white"}
              />
            }
            destructiveOptionsIndex={[1]}
            disabled={deleteMutation.isPending || images.length < 2}
          />
        </View>
        <PagerView
          style={[mt.flex1, mt.w("full"), mt.h("full")]}
          initialPage={index}
          orientation="horizontal"
          onPageSelected={(e) => setIndex(e.nativeEvent.position)}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{
                resizeMode: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          ))}
        </PagerView>
        {/* view with dots representing the current image */}
        <View
          style={[
            mt.flexRow,
            mt.justify("center"),
            mt.items("center"),
            mt.p(2),
          ]}
        >
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                mt.w(2),
                mt.h(2),
                mt.rounded("full"),
                mt.bg("gray", i === index ? 800 : 300),
                mt.mr(1),
              ]}
            />
          ))}
        </View>
        <View style={[mt.p(4)]}>
          <Button onPress={() => setVisible(false)}>
            <Text>Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

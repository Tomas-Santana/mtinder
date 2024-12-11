import { Image, Modal, Pressable, TouchableOpacity, View } from "react-native";
import { GlowingText, Text } from "../ui/text";
import { Button } from "../ui/button";
import * as ImagePicker from "expo-image-picker";
import { useAtom } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import mt from "@/style/mtWind";
import { useEffect, useState } from "react";
import mime from "mime"
import { User } from "@/types/User";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FileUpload } from "@/types/api/FileUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FileUploadWithUri = FileUpload & { uri: string };

export function UpdateProfilePic({
  visible,
  setVisible,
}: { 
  visible: boolean;
  setVisible: (value: boolean) => void;
}) {
  const [currentUser] = useAtom(userAtom);
  const [imagesUris, setImagesUris] = useState<FileUploadWithUri[]>([]);
  const pick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      aspect: [3, 4],
      selectionLimit: 5,
      quality: 1,
      base64: true,
    })

    if (!result.canceled) {
      console.log("ta dificil el asunto");
      setImagesUris(
        result.assets.map((asset) => {
          const base64 = asset.base64 as string;
          const uri = asset.uri;
          const name = asset.fileName || "image.jpg";
          const mimetype = mime.getType(uri) || "image/jpeg";
          return {
            base64,
            mimetype,
            name,
            uri,
          };
        })
      );
    }
  }

  useEffect(() => {
    console.log(currentUser?.imageUrls)
  }, [currentUser])

  const queryClient = useQueryClient()
  const uploadMutation = useMutation({})

  const printUris = (imagesUris: FileUpload[]) => {
    console.log(imagesUris);
    setVisible(false)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      style={[mt.p(10)]}
    >
      <View
        style={[
          mt.w("full"),
          mt.h("full"),
          mt.p(4),
          mt.flexCol,
          mt.justify("center"),
          mt.items("center"),
          mt.rounded("lg"),
          mt.overflow("hidden"),
        ]}
      >
        <View
          style={[
            mt.w("full"),
            mt.h("full"),
            mt.rounded("lg"),
            mt.flexCol,
            mt.justify("center"),
            mt.items("center"),
            mt.gap(4),
            mt.glow(),
            mt.bg("blackOpacity", 800, 0.9),
            mt.p(5),
          ]}
        >
          <GlowingText
            size="2xl"
            style={[mt.fontSize("2xl"), mt.color("blue"), mt.align("center")]}
            color="#80E1FF"
          >
            Update your profile picture
          </GlowingText>
          {currentUser && <UserImages user={currentUser} imagesUris={imagesUris} setImagesUris={setImagesUris} />}
          <Button onPress={pick}>
            <MaterialCommunityIcons name="camera-plus" size={30} color="black" />
          </Button>
          <Button onPress={() => printUris(imagesUris)}>
            <Text>Upload</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

interface UserImagesProps {
  user: User;
  imagesUris: FileUploadWithUri[];
  setImagesUris: React.Dispatch<React.SetStateAction<FileUploadWithUri[]>>;
}

const UserImages = ({ user, imagesUris, setImagesUris }: UserImagesProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const imagesLength = user.imageUrls?.length || 0;

  useEffect(() => {
    console.log("a", user.imageUrls?.[0])
  })

  const handlePress = () => {
    console.log("a", user.imageUrls?.[imageIndex])
  }

  return (
    <View
      style={[
        mt.flexCol,
        mt.gap(2),
        mt.flex1,
        mt.w("full"),
        mt.h("full"),
        mt.m(4),
        mt.bg("transparent"),
      ]}
    >
      <View
        style={[
          mt.rounded("sm"),
          mt.position("absolute"),
          mt.inset(0),
          mt.z(2),
        ]}
      >
        <TouchableOpacity style={[mt.position("absolute"), mt.top(5), mt.right(5), mt.z(3)]} onPress={handlePress}>
          <MaterialCommunityIcons name="trash-can" size={32} style={[mt.textGlow("sm", "red"), mt.color("red")]}/>
        </TouchableOpacity>
        <Image
          source={{ uri: user.imageUrls?.[imageIndex] }}
          style={[mt.h("full"), mt.w("full"), mt.rounded("sm"), mt.border(2), mt.resize("cover")]}
        />
      </View>
      {imagesLength > 1 &&
        <View style={[mt.flexRow, mt.justify("space-between"), mt.items("center"), mt.w("twoThirds")]}>
          <Pressable
            style={[mt.flex1, mt.items("center"), mt.justify("center")]}
            onPress={() => {
              setImageIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
            }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} style={[mt.color("blue"), mt.textGlow("sm", "blue")]}/>
          </Pressable>
          <Pressable
            style={[mt.flex1, mt.items("center"), mt.justify("center")]}
            onPress={() => {
              setImageIndex((prev) => (prev + 1) % imagesLength);
            }}
          >
            <MaterialCommunityIcons name="arrow-right" size={24} style={[mt.color("blue"), mt.textGlow("sm", "blue")]}/>
          </Pressable>
        </View>
      }
    </View>
  );
};

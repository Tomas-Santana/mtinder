import { View, SafeAreaView, Image } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import PhotosController from "@/api/controllers/PhotosController";
import { useMutation } from "@tanstack/react-query";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { resourceURL } from "@/api/routes";
import FirebaseUploadController from "@/api/controllers/UploadController";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";


export default function CompleteProfile() {
  const [imageUris, setImageUris] = React.useState<string[]>([]);
  const user = useAtomValue(userAtom);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      aspect: [3, 4],
      selectionLimit: 5,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImageUris(result.assets.map((asset) => asset.uri));
      result.assets.map((as) => console.log(
        base64ToFile(as.base64!, as.uri, "image/jpeg").name
      ));
    }
  };

  const uploadMutation = useMutation({
    mutationFn: (files: string[]) => {
      return FirebaseUploadController.uploadProfilePictures({
        uris: files,
        userId: user?._id!,
      });
    },
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: (data) => {
      data.forEach((file) => {
        console.log(file.downloadUrl);
      });
    },
  });

  return (
    <SafeAreaView>
      <View style={[mt.flexCol, mt.gap(4), mt.p(4)]}>
        <Text style={[mt.color("white")]}>CompleteProfile</Text>

        <Button onPress={pickImage}>
          <Text>Upload Image</Text>
        </Button>

        <Animated.View
          style={[mt.flexRow, mt.flexWrap, mt.w("full"), mt.h(96), mt.gap(2)]}
          layout={LinearTransition}
        >
          {imageUris &&
            imageUris.map((image, index) => (
              <ImagePreview
                key={index}
                image={image}
                setImages={setImageUris}
              />
            ))}
        </Animated.View>

        <Button
          onPress={() => {
            uploadMutation.mutate(imageUris);
          }}
          disabled={uploadMutation.isPending || imageUris.length === 0}
        >
          <Text>{uploadMutation.isPending ? "loading" : "upload"}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

export function ImagePreview({
  image,
  setImages,
}: {
  image: string;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  // image with a little button that allow deletion
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition}
      style={[
        mt.pxh(200),
        mt.flex1,
        mt.borderColor("blue", 300),
        mt.position("relative"),
      ]}
    >
      <Image
        source={{ uri: image }}
        style={[{ resizeMode: "cover" }, mt.pxh(200), mt.w("full")]}
      />
      <Button
        style={[
          mt.position("absolute"),
          mt.bottom(2),
          mt.right(2),
          mt.p(2),
          mt.z(1),
          mt.backgroundColor("red"),
        ]}
        variant="danger"
        onPress={() => {
          setImages((prev) => prev.filter((prevImage) => image != prevImage));
        }}
      >
        <Text>✂</Text>
      </Button>
    </Animated.View>
  );
}

function base64ToFile(
  base64: string,
  filename: string,
  mimeType: string
): File {
  const byteString = atob(base64);
  // log the first 100 characters of the byteString to see if it's correct
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  console.log(ia.subarray(0, 100));
  return new File([ia], filename, { type: mimeType });
}

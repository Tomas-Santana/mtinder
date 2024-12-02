import { View, SafeAreaView, Image } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/ui/button";
import React from "react";
import PhotosController from "@/api/controllers/PhotosController";
import { useMutation } from "@tanstack/react-query";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { resourceURL } from "@/api/routes";

const imagesBase64: string[] = [];

export default function CompleteProfile() {
  const [images, setImages] = React.useState<string[] | null>(null);
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
      setImages(result.assets.map((image) => image.uri));
      result.assets.forEach((image) => {
        imagesBase64.push(image.base64!);
      });
    }
  };

  const uploadMutation = useMutation({
    mutationFn: PhotosController.uploadImages,
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: (data) => {
      console.log("Photos uploaded", data.imageUrls?.map(url => (resourceURL + "/" + url)));
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
          {images &&
            images.map((image, index) => (
              <ImagePreview key={index} image={image} setImages={setImages} />
            ))}
        </Animated.View>

        <Button
          onPress={() => {
            uploadMutation.mutate({ imagesBase64 });
          }}
          disabled={uploadMutation.isPending}
        >
          <Text>
            {uploadMutation.isPending ? "loading" : "upload"}
          </Text>
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
  setImages: React.Dispatch<React.SetStateAction<string[] | null>>;
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
          mt.backgroundColor("red")
        ]}
        variant="danger"
        onPress={() =>
          setImages((prev) =>
            prev ? prev.filter((prevImage) => image != prevImage) : null
          )
        }
      >
        <Text>✂</Text>
      </Button>
    </Animated.View>
  );
}

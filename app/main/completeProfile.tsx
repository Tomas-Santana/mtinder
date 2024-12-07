import { View, SafeAreaView, Image, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/ui/button";
import React from "react";
import PhotosController from "@/api/controllers/PhotosController";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import mime from "mime";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { GlowingText } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { FileUpload } from "@/types/api/FileUpload";
import { genres } from "@/constants/genres";
import { VerticalTabs, Tab } from "@/components/ui/tabs";

type FileUploadWithUri = FileUpload & { uri: string };

export default function CompleteProfile() {
  const [imagesUris, setImagesUris] = React.useState<FileUploadWithUri[]>([]);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      aspect: [3, 4],
      selectionLimit: 5,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      console.log("p");
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
  };
  const queryClient = useQueryClient();
  const uploadMutation = useMutation({
    mutationFn: (imagesUris: FileUpload[]) => {
      return PhotosController.uploadImages({
        images: imagesUris,
        genres: [],
      });
    },
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: (data) => {
      data.imageUrls?.map((url) => console.log(url));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/main/home");
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View
        style={[mt.flexCol, mt.gap(4), mt.p(4), mt.flex1]}
        layout={LinearTransition}
      >
        <Animated.View
          style={[mt.flexCol, mt.gap(4)]}
          layout={LinearTransition}
        >
          <Text style={[mt.color("white")]} size="2xl">
            Hey
            <GlowingText
              style={[mt.fontSize("2xl"), mt.color("blue")]}
              color="#80E1FF"
            >
              {" "}
              {user?.firstName ?? "there"}!{" "}
            </GlowingText>
            Let's finish up your profile
          </Text>

          <Text style={[mt.color("white")]} size="lg">
            Upload your best pics (up to 5)
          </Text>
        </Animated.View>

          <Button onPress={pickImage}>
            <Text>Open photos</Text>
          </Button>
        <Animated.View
          style={[mt.flexRow, mt.flexWrap, mt.w("full"), mt.gap(2), mt.flex1]}
          layout={LinearTransition}
        >
          <ScrollView
            horizontal
            contentContainerStyle={[
              mt.gap(4),
              mt.flexRow,
              mt.p(2),
              mt.justify("center"),
              mt.items("center"),
              mt.h("full"),
            ]}
            snapToInterval={330}
            snapToAlignment="center"
            decelerationRate="fast"
          >
            {imagesUris &&
              imagesUris.map((image, index) => (
                <ImagePreview
                  key={index}
                  image={image}
                  setImages={setImagesUris}
                />
              ))}
          </ScrollView>
        </Animated.View>

        <Button
          onPress={() => {
            uploadMutation.mutate(imagesUris);
          }}
          disabled={uploadMutation.isPending || imagesUris.length === 0}
          loading={uploadMutation.isPending}
        >
          <Text>Save</Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

export function ImagePreview({
  image,
  setImages,
}: {
  image: FileUploadWithUri;
  setImages: React.Dispatch<React.SetStateAction<FileUploadWithUri[]>>;
}) {
  // image with a little button that allow deletion
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition}
      style={[
        mt.pxw(320),
        mt.flex1,
        mt.position("relative"),
        mt.items("center"),
        mt.rounded("md"),
        mt.justify("center"),
        // mt.backgroundColor("white"),
        mt.glow("sm"),
        mt.p(2),
        mt.gap(2),
      ]}
    >
      <Image
        source={{ uri: image.uri }}
        style={[
          { resizeMode: "cover" },
          mt.pxh(390),
          mt.pxw(300),
          mt.rounded("sm"),
        ]}
      />
      <Button
        variant="danger"
        onPress={() => {
          setImages((prev) =>
            prev.filter((prevImage) => image.uri != prevImage.uri)
          );
        }}
      >
        <Text>✂</Text>
      </Button>
    </Animated.View>
  );
}

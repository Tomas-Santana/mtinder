import { View, SafeAreaView, Image, ScrollView, Pressable } from "react-native";
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
import PagerView from "react-native-pager-view";
import { ImagePreview } from "@/components/app/CompleteProfile/ImagePreview";
import { CPushButton } from "@/components/ui/button";

type FileUploadWithUri = FileUpload & { uri: string };

export default function CompleteProfile() {
  const [imagesUris, setImagesUris] = React.useState<FileUploadWithUri[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
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
        genres: selectedGenres,
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
        </Animated.View>
        <VerticalTabs fill>
          <Tab name="Images">
            <ImageTab
              imagesUris={imagesUris}
              setImagesUris={setImagesUris}
              setCurrentImageIndex={setCurrentImageIndex}
              currentImageIndex={currentImageIndex}
              pickImage={pickImage}
            />
          </Tab>
          <Tab name="Genres">
            <GenresTab
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
            />
          </Tab>
        </VerticalTabs>

        <Button
          onPress={() => {
            uploadMutation.mutate(imagesUris);
          }}
          disabled={uploadMutation.isPending || imagesUris.length === 0 || selectedGenres.length === 0}
          loading={uploadMutation.isPending}
        >
          <Text
            style={[mt.color("white")]}
          >Save</Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

interface ImageTabProps {
  imagesUris: FileUploadWithUri[];
  setImagesUris: React.Dispatch<React.SetStateAction<FileUploadWithUri[]>>;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  currentImageIndex: number;
  pickImage: () => void;
}

function ImageTab({
  imagesUris,
  setImagesUris,
  setCurrentImageIndex,
  currentImageIndex,
  pickImage,
}: ImageTabProps) {
  return (
    <Animated.View style={[mt.flexCol, mt.flex1, mt.w("full"), mt.gap(2)]}>
      <Text style={[mt.color("white")]} size="md">
        Upload your best pics (up to 5)
      </Text>
      <Button onPress={pickImage}>
        <Text>Open photos</Text>
      </Button>
      <PagerView
        style={[
          mt.p(2),
          mt.justify("center"),
          mt.items("center"),
          mt.flex1,
          mt.w("full"),
          mt.border(2),
        ]}
        initialPage={0}
        collapsable={false}
        orientation={"horizontal"}
        onPageSelected={(event) => {
          setCurrentImageIndex(event.nativeEvent.position);
        }}
      >
        {imagesUris &&
          imagesUris.map((image, index) => (
            <ImagePreview key={index} image={image} setImages={setImagesUris} />
          ))}
      </PagerView>
      {imagesUris.length > 0 && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            mt.flexRow,
            mt.justify("center"),
            mt.items("center"),
            mt.h(4),
            mt.gap(2),
          ]}
        >
          {imagesUris.map((_, index) => (
            <View
              key={index}
              style={[
                mt.w(4),
                mt.h(4),
                mt.rounded("full"),
                mt.bg(index === currentImageIndex ? "white" : "gray"),
              ]}
            ></View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}
interface GenresTabProps {
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
}
function GenresTab({ selectedGenres, setSelectedGenres }: GenresTabProps) {
  function toggleGenre(genre: string): React.SetStateAction<string[]> {
    return (prev) =>
      prev.includes(genre)
        ? prev.filter((prevGenre) => prevGenre !== genre)
        : prev.length >= 5
        ? [genre, ...prev.slice(0, -1)]
        : [...prev, genre];
  }
  return (
    <View
      style={[
        mt.flexCol,
        mt.gap(2),
        mt.justify("center"),
        mt.items("center"),
        mt.flex1,
        mt.w("full"),
      ]}
    >
      <Text style={[mt.color("white")]} size="md">
        Choose your favorite genres (up to 10)
      </Text>
      <View
        style={[
          mt.flexRow,
          mt.flexWrap,
          mt.w("full"),
          mt.flex1,
          mt.gap(2),
          mt.items("center"),
          
        ]}
      >
        {genres.map((genre) => (
          <CPushButton
            key={genre}
            onPress={() => {
              setSelectedGenres(toggleGenre(genre));
            }}
            isPushed={selectedGenres.includes(genre)}
          >
            <Text>{genre}</Text>
          </CPushButton>
        ))}
      </View>
      {/* pressable for clear */}
      <Pressable
        onPress={() => {
          setSelectedGenres([]);
        }}
      >
        <Text
          style={[mt.color("red")]} 
        >Clear</Text>
      </Pressable>
    </View>
  );
}

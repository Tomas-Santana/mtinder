import mt from "@/style/mtWind";
import { FileUpload } from "@/types/api/FileUpload";
import { Image } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

type FileUploadWithUri = FileUpload & { uri: string };

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
        mt.w("full"),
        mt.m(2),
        mt.flex1,
        mt.position("relative"),
        mt.items("center"),
        mt.rounded("md"),
        mt.justify("center"),
        mt.glow("sm"),
        mt.p(4),
        mt.gap(2),
      ]}
    >
      <Image
        source={{ uri: image.uri }}
        style={[
          { resizeMode: "cover" },
          mt.flex1,
          mt.w("full"),
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

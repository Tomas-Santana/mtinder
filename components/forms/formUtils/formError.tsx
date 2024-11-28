import type { FieldError } from "react-hook-form";
import { Text } from "../../ui/text";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import mt from "@/style/mtWind";

interface FormErrorProps {
  error?: FieldError;
}

export function FormError({ error }: FormErrorProps) {
  return (
    <>
      {error && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          layout={LinearTransition}
        >
          <Text style={[mt.color("red", 500), mt.fontSize("base")]}>
            {error.message}
          </Text>
        </Animated.View>
      )}
    </>
  );
}

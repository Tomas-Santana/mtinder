import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Chater() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text style={[mt.color("white")]}>
        Chater for {id}
      </Text>
    </View>
  );
}

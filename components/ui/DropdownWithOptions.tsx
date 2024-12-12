import { View, TouchableOpacity } from "react-native";
import mt from "@/style/mtWind";
import { Text } from "./text";
import { useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface DropdownWithOptionsProps {
  options: string[];
  onSelect: (option: string) => void;
  position: "br" | "bl";
  trigger: React.ReactNode;
  destructiveOptionsIndex?: number[];
  disabled?: boolean;
}

// This component is a dropdown that shows a list of options when the trigger is pressed

export const DropdownWithOptions: React.FC<DropdownWithOptionsProps> = ({
  options,
  onSelect,
  position,
  trigger,
  destructiveOptionsIndex = [],
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);



  return (
    <View style={[mt.position("relative")]}>
      <TouchableOpacity onPress={() => setVisible(!visible)}
        disabled={disabled}
        > 
        {trigger}
      </TouchableOpacity>
      {visible && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            mt.position("absolute"),
            mt.bg("black"),
            mt.rounded("md"),
            mt.glow("md"),
            mt.z(10),
            mt.w(40),
            mt.top(8),
            mt.right(2),
            
          ]}
        >
          {options.map((option) => (
            <Text
              key={option}
              style={[mt.p(2), mt.color(
                destructiveOptionsIndex.includes(options.indexOf(option))
                  ? "red"
                  : "white"
              ),
              mt.borderB(1),
              mt.borderColor("white") 
            ]}
              onPress={() => {onSelect(option); setVisible(false)}}
            >
              {option}
            </Text>
          ))}
          <Text
            style={[mt.p(2), mt.color("white")]}
            onPress={() => setVisible(false)}
          >
            Close
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

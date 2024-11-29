import { View, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, Platform } from "react-native";
import { Text, GlowingText } from "./text";
import { Button } from "./button";
import mt from "@/style/mtWind";
import { useCallback, useState, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";

type OptionsItem = {
  label: string;
  value: string;
}

interface DropDownProps {
  data: OptionsItem[];
  onChange: (item: OptionsItem) => void;
  placeholder: string;
}

export default function DropDown({ data, onChange, placeholder }: DropDownProps) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("")

  const toggleExpanded = useCallback(() => {setExpanded(!expanded)}, [])

  const buttonRef = useRef<View>(null)

  const [top, setTop] = useState(0)

  const onSelect = (item: OptionsItem) => {
    setValue(item.label)
    onChange(item)
    setExpanded(false) 
  }

  return (
    <View
      ref={buttonRef}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        const topOffset = layout.y;
        const heightOfComponent = layout.height;

        const finalValue =
          topOffset + heightOfComponent + (Platform.OS === "android" ? -32 : 3);

        setTop(finalValue);
      }}
      style={[mt.p(4)]}
    >
      <TouchableOpacity
        style={[
          mt.flexRow,
          mt.justify("space-between"),
          mt.gap(4),
          mt.p(3),
          mt.w("full"),
          mt.items("center"),
          mt.color("white"),
          mt.border(2),
          mt.borderColor("gray"),
        ]}
        activeOpacity={0.8}
        onPress={toggleExpanded}
      >
        <GlowingText color="white" style={[mt.color("white")]}>{value || placeholder}</GlowingText>
        <AntDesign name={expanded ? "caretup" : "caretdown"} color={"white"}/>
      </TouchableOpacity>
      {expanded ? (
        <Modal visible={expanded} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
            <View style={[mt.p(8), mt.justify("center"), mt.items("center"), mt.flex1, mt.mt(8)]}>
              <View
                style={[
                  mt.position("absolute"),  
                  mt.w("full"),
                  mt.p(2),
                  mt.border(2),
                  mt.borderColor("gray"),  
                  mt.maxH(52),
                  { backgroundColor: "#191919", zIndex: 10 },
                  {top},
                ]}
              >
                <FlatList
                  keyExtractor={(item) => item.value}
                  data={data}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[mt.h(8), mt.justify("center")]}
                      activeOpacity={0.8}
                      onPress={() => onSelect(item)}
                    >
                      <Text style={[mt.color("white")]}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={[mt.h(8)]} />}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>  
        </Modal>
      ) : null}
    </View>
  );
}

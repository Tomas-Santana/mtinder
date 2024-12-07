import mt from "@/style/mtWind";
import type { MTTypes } from "@/style/mtWind";
import { Button, CPushButton } from "./button";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import React from "react";
import { View } from "react-native";
import { Text } from "./text";

interface TabProps {
  children: React.ReactNode;
  name: string;
  onSelected?: () => void;
}

export function Tab({ children, name, onSelected }: TabProps) {
  return (
    <Animated.View
      entering={ZoomIn}
      exiting={ZoomOut}
      style={[mt.flexCol, mt.justify("center"), mt.w("full")]}
    >
      {children}
    </Animated.View>
  );
}

interface TabsProps {
  // children should be an array of Tab components
  children: React.ReactElement<TabProps>[];
  activeTab?: number;
  tabHeight?: MTTypes["Pixels"];
}

export function VerticalTabs({
  children,
  activeTab = 0,
  tabHeight,
}: TabsProps) {
  const [tab, setTab] = React.useState(activeTab);
  const tabNames = children.map((child) => {
    return child.props.name;
  });

  // handle onSelected
  React.useEffect(() => {
    children[tab].props.onSelected?.();
  }, [tab]);

  return (
    <Animated.View
      style={[
        mt.flexCol,
        mt.gap(4),
        mt.justify("center"),
        mt.items("center"),
        mt.w("full"),
      ]}
    >
      {/* cpushbuttons with tabs */}
      <View
        style={[mt.flexRow, mt.gap(2), mt.justify("center"), mt.items("center")]}
      >
        {tabNames.map((name, index) => (
          <CPushButton
            isPushed={tab === index}
            key={index}
            onPress={() => setTab(index)}
            variant={tab === index ? "primary" : "secondary"}
          >
            <Text>{name}</Text>
          </CPushButton>
        ))}
      </View>

      {/* tabs */}

      <View
        style={[
          mt.flex1,
          mt.w("full"),
          ...(tabHeight ? [mt.h(tabHeight)] : []),
          mt.justify("center"),
          mt.items("center"),
        ]}
      >
        {children[tab]}
      </View>
    </Animated.View>
  );
}

export function HorizontalTabs({
  children,
  activeTab = 0,
  tabHeight,
}: TabsProps) {
  const [tab, setTab] = React.useState(activeTab);
  const tabNames = children.map((child) => {
    return child.props.name;
  });

  // handle onSelected
  React.useEffect(() => {
    children[tab].props.onSelected?.();
  }, [tab]);

  return (
    <Animated.View
      style={[
        mt.flexRow,
        mt.gap(4),
        mt.justify("center"),
        mt.items("center"),
        mt.w("full"),
      ]}
    >
      {/* cpushbuttons with tabs */}
      <View
        style={[
          mt.flexCol,
          mt.justify("center"),
          mt.items("center"),
          mt.gap(2),
        ]}
      >
        {tabNames.map((name, index) => (
          <CPushButton
            isPushed={tab === index}
            key={index}
            onPress={() => setTab(index)}
            variant={tab === index ? "primary" : "secondary"}
          >
            <Text>{name}</Text>
          </CPushButton>
        ))}
      </View>

      {/* tabs */}

      <View
        style={[
          mt.flex1,
          mt.w("full"),
          ...(tabHeight ? [mt.h(tabHeight)] : []),
          mt.justify("center"),
          mt.items("center"),
        ]}
      >
        {children[tab]}
      </View>
    </Animated.View>
  );
}

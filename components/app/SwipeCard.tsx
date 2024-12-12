import mt from "@/style/mtWind";
import { User } from "@/types/User";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  Pressable,
} from "react-native";
import { Text } from "../ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Reanimated from "react-native-reanimated";
import { NoMoreScroll } from "./noMoreScroll";

const { width, height } = Dimensions.get("window");

export interface Card {
  user: User;
}

interface SwipeProps {
  onRightSwipe: (card: Card) => void;
  onLeftSwipe: (card: Card) => void;
  cardsData: Card[];
}

export default function SwipeCard({
  onRightSwipe,
  onLeftSwipe,
  cardsData,
}: SwipeProps) {
  const [cards, setCards] = useState<Card[]>(cardsData);

  const animatedCards = cards.map(() => ({
    pan: new Animated.ValueXY(),
    rotate: new Animated.Value(0).interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: ["-20deg", "0deg", "20deg"],
      extrapolate: "clamp",
    }),
    scale: new Animated.Value(1),
  }));

  const handlePanResponderMove = (
    event: any,
    gestureState: any,
    index: number
  ): void => {
    animatedCards[index].pan.setValue({
      x: gestureState.dx,
      y: gestureState.dy,
    });
  };

  const handlePanResponderRelease = (
    event: any,
    gestureState: any,
    index: number
  ): void => {
    if (gestureState.dx > 120) {
      swipeCard("right", index);
    } else if (gestureState.dx < -120) {
      swipeCard("left", index);
    } else {
      resetCardPosition(index);
    }
  };

  const swipeCard = (direction: "right" | "left", index: number): void => {
    Animated.timing(animatedCards[index].pan, {
      toValue: { x: direction === "right" ? width : -width, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      const card = cards[index];
      removeCard();
      if (direction === "right") {
        onRightSwipe(card);
      } else if (direction === "left") {
        onLeftSwipe(card);
      }
    });
  };

  const removeCard = (): void => {
    const newCards = [...cards];
    newCards.shift();
    setCards(newCards);
  };

  // Resetear la posición de la carta al centro
  const resetCardPosition = (index: number): void => {
    Animated.spring(animatedCards[index].pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const panResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event: any, gestureState: any) =>
        handlePanResponderMove(event, gestureState, index),
      onPanResponderRelease: (event: any, gestureState: any) =>
        handlePanResponderRelease(event, gestureState, index),
    });
  if (cards.length === 0) {
    return <NoMoreScroll />
  }

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        const isTopCard = index === 0;

        const backgroundColor = animatedCards[index].pan.x.interpolate({
          inputRange: [-width, 0, width],
          outputRange: [
            "rgba(255, 0, 0, 1)",
            "rgba(0, 0, 0, 0)",
            "rgba(0, 255, 0, 1)",
          ],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={card.user._id}
            {...(isTopCard ? panResponder(index).panHandlers : {})}
            style={[
              styles.card,

              {
                transform: [
                  { translateX: animatedCards[index].pan.x },
                  { translateY: animatedCards[index].pan.y },
                  { rotate: animatedCards[index].rotate },
                ],
                backgroundColor,
                zIndex: cards.length - index,
                top: 10 * index,
                opacity: isTopCard ? 1 : 0.8,
              },
              mt.bg("transparent"),
            ]}
          >
            <Animated.View
              style={[styles.background, { backgroundColor }, mt.rounded("lg")]}
            />
            <UserCard user={card.user} />
          </Animated.View>
        );
      })}
    </View>
  );
}

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const imagesLength = user.imageUrls?.length || 0;

  return (
    <View
      style={[
        mt.flexCol,
        mt.gap(2),
        mt.flex1,
        mt.w("full"),
        mt.h("full"),
        mt.m(4),
        mt.bg("transparent"),
      ]}
    >
      <View
        style={[
          mt.flex1,
          mt.items("flex-end"),
          mt.justify("flex-end"),
          mt.flexCol,
          mt.w("full"),
          mt.p(4),
          mt.h("full"),
          mt.position("relative"),
        ]}
      >
        <Text size="2xl">
          {user.firstName} {user.lastName}
        </Text>
        <Text size="lg">Likes {user.favoriteGenres?.join(", ")}</Text>

        <View
          style={[
            mt.rounded("lg"),
            mt.position("absolute"),
            mt.inset(0),
            mt.z(-2),
          ]}
        >
          <Image
            source={{ uri: user.imageUrls?.[imageIndex] }}
            style={[mt.flex1, mt.w("full"), mt.rounded("lg")]}
          ></Image>
        </View>

        <LinearGradient
          colors={["transparent", "transparent", "white"]}
          style={[
            mt.flex1,
            mt.position("absolute"),
            mt.inset(0),
            mt.rounded("lg"),
            mt.z(-1),
          ]}
        />
        {imagesLength > 1 && (
          <View
            style={[
              mt.flexRow,
              mt.justify("space-between"),
              mt.items("center"),
              mt.w("full"),
            ]}
          >
            <Pressable
              style={[mt.flex1, mt.items("center"), mt.justify("center")]}
              onPress={() => {
                setImageIndex(
                  (prev) => (prev - 1 + imagesLength) % imagesLength
                );
              }}
            >
              {/* arrow left */}
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="black"
              />
            </Pressable>
            <Pressable
              style={[mt.flex1, mt.items("center"), mt.justify("center")]}
              onPress={() => {
                setImageIndex((prev) => (prev + 1) % imagesLength);
              }}
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="black"
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  card: {
    width: width - 40,
    height: "100%",
    borderRadius: 5,
    elevation: 5,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    top: 16,
    bottom: 16,
    left: 0,
    right: 0,
    borderRadius: 5,
  },
});

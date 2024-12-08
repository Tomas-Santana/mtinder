import { View } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";
import SwipeCard from "@/components/app/SwipeCard";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import { Card } from "@/components/app/SwipeCard";
import { useQuery } from "@tanstack/react-query";
import UserController from "@/api/controllers/UserController";
import { useMe } from "@/hooks/useMe";

const data = [
  { id: 1, name: "Juan" },
  { id: 2, name: "Maria" },
  { id: 3, name: "Carlos" },
  { id: 4, name: "Ana" },
];

export default function Home() {
  const user = useAtomValue(userAtom);
  const [currentCard, setCurrentCard] = useState<Card>();

  const meQuery = useMe();

  if (!user) {
    return <Redirect href="/" />;
  }

  if (!meQuery.data?.me.profileReady) {
    return <Redirect href="/main/completeProfile" />;
  }
  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => UserController.getUsers(),
  });

  const liked = (card: Card) => {
    console.log("Liked", card);
    setCurrentCard(card);
    router.push({
      pathname: "/chat/",
      params: {
        user: JSON.stringify(card.user),
      },
    });
  };

  const disliked = (card: Card) => {
    console.log("Disliked", card);
    setCurrentCard(card);
  };

  return (
    <View style={[mt.flex1, mt.justify("center"), mt.items("center")]}>
      <Navbar />
      {userQuery.data && (
        <SwipeCard
          onLeftSwipe={disliked}
          onRightSwipe={liked}
          cardsData={userQuery.data.map((user) => ({ user }))}
        />
      )}

      {currentCard && <Text>{currentCard.user.firstName}</Text>}
    </View>
  );
}

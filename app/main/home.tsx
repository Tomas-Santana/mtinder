import { View } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";
import SwipeCard from "@/components/app/SwipeCard";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { Link, Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/app/SwipeCard";
import { useQuery } from "@tanstack/react-query";
import UserController from "@/api/controllers/UserController";
import { useChats } from "@/hooks/useChats";
import { useMutation } from "@tanstack/react-query";
import MatchController from "@/api/controllers/MatchController";
import { ToastAndroid } from "react-native";


export default function Home() {
  const user = useAtomValue(userAtom);
  const [currentCard, setCurrentCard] = useState<Card>();

  const chatsQuery = useChats();

  const requestMatch = useMutation({
    mutationFn: MatchController.requestMatch,
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: (data) => {
      ToastAndroid.show(`Match ${data.status}`, ToastAndroid.SHORT);
    },
  });


  if (!user) {
    return <Redirect href="/" />;
  }

  if (!user.profileReady) {
    return <Redirect href="/main/completeProfile" />;
  }
  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => UserController.getUsers(),
  });

  const liked = (card: Card) => {
    console.log("Liked", card);
    setCurrentCard(card);
    requestMatch.mutate({ userId: card.user._id });
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

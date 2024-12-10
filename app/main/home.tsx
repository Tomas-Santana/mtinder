import { View, SafeAreaView } from "react-native";
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
import { useMatchRequests } from "@/hooks/useMatchRequests";
import { MatchModal } from "@/components/app/matchModal";


export default function Home() {
  const user = useAtomValue(userAtom);
  const [currentCard, setCurrentCard] = useState<Card>();
  const chatsQuery = useChats();
  const matchRequestsQuery = useMatchRequests();

  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  const [matchChatId, setMatchChatId] = useState<string | null>(null);

  const requestMatch = useMutation({
    mutationFn: MatchController.requestMatch,
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: (data) => {
      if (data.chatId) {
        setMatchChatId(data.chatId);
      }
    },
    onMutate: (variables) => {
      const hasRequestedMe = !!matchRequestsQuery.data?.requests.some(
        (req) => req.from === variables.userId
      );
      console.log("hasRequestedMe", matchRequestsQuery.data);
      if (hasRequestedMe) {
        setOpenMatchDialog(true);
        return;
      }
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
    setCurrentCard(card);
    requestMatch.mutate({ userId: card.user._id });
  };

  const disliked = (card: Card) => {
    setCurrentCard(card);
  };

  return (
    <SafeAreaView style={[mt.flex1, mt.justify("center"), mt.items("center")]}>
      <Navbar />
      {userQuery.data && (
        <SwipeCard
          onLeftSwipe={disliked}
          onRightSwipe={liked}
          cardsData={userQuery.data.map((user) => ({ user }))}
        />
      )}

      {currentCard && <Text>{currentCard.user.firstName}</Text>}
      <MatchModal
        chatId={matchChatId}
        isOpen={openMatchDialog}
        setIsOpen={setOpenMatchDialog}
        onCancel={() => {
          setMatchChatId(null);
        }}
        user={currentCard?.user ?? null}
      />
    </SafeAreaView>
  );
}

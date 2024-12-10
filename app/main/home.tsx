import { SafeAreaView } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";
import SwipeCard from "@/components/app/SwipeCard";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { Redirect } from "expo-router";
import { useState } from "react";
import { Card } from "@/components/app/SwipeCard";
import { useQuery } from "@tanstack/react-query";
import UserController from "@/api/controllers/UserController";
import { useMutation } from "@tanstack/react-query";
import MatchController from "@/api/controllers/MatchController";
import { useMatchRequests } from "@/hooks/useMatchRequests";
import { MatchModal } from "@/components/app/matchModal";


export default function Home() {
  const currentUser = useAtomValue(userAtom);
  const [currentCard, setCurrentCard] = useState<Card>();
  
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
      if (hasRequestedMe) {
        setOpenMatchDialog(true);
        return;
      }
    },
  });


  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => UserController.getUsers(),
  });
  
  if (!currentUser) {
    return <Redirect href="/" />;
  }

  if (!currentUser.profileReady) {
    return <Redirect href="/main/completeProfile" />;
  }
  const filterUsers = (users: Card[]) => {
    return users.filter( user => 
      user.user._id !== currentUser._id &&
      user.user.favoriteGenres?.some(genre => currentUser.favoriteGenres?.includes(genre))
    )
  }
  
  const filteredUsers = userQuery.data ? filterUsers(userQuery.data.map(user => ({ user }))) : []

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
          cardsData={filteredUsers}
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

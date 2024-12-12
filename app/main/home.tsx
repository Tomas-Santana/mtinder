import { SafeAreaView } from "react-native";
import { Text } from "@/components/ui/text";
import mt from "@/style/mtWind";
import Navbar from "@/components/app/navbar";
import SwipeCard from "@/components/app/SwipeCard";
import { userAtom } from "@/utils/atoms/userAtom";
import { useAtomValue } from "jotai";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/app/SwipeCard";
import { useQuery } from "@tanstack/react-query";
import UserController from "@/api/controllers/UserController";
import { useMutation } from "@tanstack/react-query";
import MatchController from "@/api/controllers/MatchController";
import { useMatchRequests } from "@/hooks/useMatchRequests";
import { MatchModal } from "@/components/app/matchModal";
import { Chat, ReducedChat } from "@/types/Chat";
import { useFocusEffect } from "expo-router";

export default function Home() {
  const currentUser = useAtomValue(userAtom);
  const [currentCard, setCurrentCard] = useState<Card>();

  const matchRequestsQuery = useMatchRequests();

  const [openMatchDialog, setOpenMatchDialog] = useState(false);
  const [matchChat, setMatchChat] = useState<ReducedChat | null>(null);

  const requestMatch = useMutation({
    mutationFn: MatchController.requestMatch,
    onError: (error) => {
      console.log(error.message);
    },
    onSuccess: (data) => {
      if (data.chat) {
        setMatchChat(data.chat);
        setOpenMatchDialog(true);
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

  useEffect(() => {
    console.log("possible matches" ,userQuery.data

    )
  }, [userQuery.data]);

  

  if (!currentUser) {
    console.log("no user");
    return <Redirect href="/" />;
  }

  if (!currentUser.profileReady) {
    console.log("no profile");
    return <Redirect href="/main/completeProfile" />;
  }


  const filteredUsers = userQuery.data
    ? userQuery.data.map((user) => ({ user }))
    : [];

  const liked = (card: Card) => {
    setCurrentCard(card);
    requestMatch.mutate({ userId: card.user._id });
  };

  const disliked = (card: Card) => {
    setCurrentCard(card);
  };

  return (
    <SafeAreaView style={[mt.flex1, mt.justify("flex-start"), mt.items("center")]}>
      <Navbar />
      {userQuery.data && (
        
        <SwipeCard
          onLeftSwipe={disliked}
          onRightSwipe={liked}
          cardsData={filteredUsers}
        />
      )}

      <MatchModal
        chat={matchChat}
        isOpen={openMatchDialog}
        setIsOpen={setOpenMatchDialog}
        onCancel={() => {
          setMatchChat(null);
        }}
        user={currentCard?.user ?? null}
      />
    </SafeAreaView>
  );
}

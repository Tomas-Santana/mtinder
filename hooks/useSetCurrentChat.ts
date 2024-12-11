import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { currentChatAtom } from "@/utils/atoms/currentChatAtom";

export const useSetCurrentChat = (chatId: string) => {
  const setCurrentChat = useSetAtom(currentChatAtom);

  useFocusEffect(
    useCallback(() => {
      setCurrentChat(chatId);
      return () => {
        setCurrentChat(null);
      };
    }, [])
  );
};
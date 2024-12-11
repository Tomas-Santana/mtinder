import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { currentChatIdAtom } from "@/utils/atoms/currentChatAtom";

export const useSetCurrentChat = (chatId: string) => {
  const setCurrentChat = useSetAtom(currentChatIdAtom);

  useFocusEffect(
    useCallback(() => {
      setCurrentChat(chatId);
      return () => {
        setCurrentChat(null);
      };
    }, [])
  );
};

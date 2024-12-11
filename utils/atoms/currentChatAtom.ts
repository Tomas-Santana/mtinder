import { atom } from "jotai";
import type { Chat } from "@/types/Chat";

export const currentChatIdAtom = atom<string | null>(null);
export const currentChatAtom = atom<Chat | null>(null);

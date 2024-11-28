import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/User";

export const userAtom = atomWithStorage<User | null>("user", null);

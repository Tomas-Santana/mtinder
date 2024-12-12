import { socket } from "@/api/controllers/SocketController";
import { Stack, useFocusEffect } from "expo-router";
import { useCallback } from "react";


export default function AuthLayout() {
  useFocusEffect(() => {
    useCallback(() => {
      if (socket.connected) socket.disconnect();
    }, [])
  });
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: "#191919",
        height: "100%"
      }
    }}
    >
      
    </Stack>
  );
}
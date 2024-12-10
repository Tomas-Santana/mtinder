// import { Toast } from "@/components/ui/toast";
// import { View } from "react-native";
// import { Link } from "expo-router";
// import { Text } from "@/components/ui/text";
// import mt from "@/style/mtWind";
// import { socket } from "@/api/controllers/SocketController";
// import { useQueryClient } from "@tanstack/react-query";
// import { GetChatsResponse } from "@/types/api/GetChats";
// import { Chat } from "@/types/Chat";
// import { GetMatchRequestsResponse } from "@/types/api/GetMatchRequests";
// import { MatchRequest } from "@/types/MatchRequest";
// import { useEffect } from "react";

// export const useSubscribe = () => {
//   const queryClient = useQueryClient();

//   const handleNewChat = (newChat: Chat) => {
//     const oldChats = queryClient.getQueryData<GetChatsResponse>(["chats"]);
//     if (!!oldChats?.chats?.some((chat) => chat._id === newChat._id)) {
//       return;
//     }

//     Toast.custom(<ChatToastContent chatId={newChat._id} />);
//     queryClient.setQueryData<GetChatsResponse>(["chats"], (data) => {
//       return {
//         chats: [...(data?.chats || []), newChat],
//       };
//     });
//     queryClient.invalidateQueries({ queryKey: ["chats"], exact: true });
//   };

//   const handleNewMatchRequest = (newMatchRequest: MatchRequest) => {
//     const oldRequests = queryClient.getQueryData<GetMatchRequestsResponse>([
//       "matchRequests",
//     ]);

//     if (
//       !!oldRequests?.requests?.some((req) => req.from === newMatchRequest.from)
//     ) {
//       return;
//     }

//     queryClient.setQueryData<GetMatchRequestsResponse>(
//       ["matchRequests"],
//       (data) => {
//         return {
//           requests: [...(data?.requests || []), newMatchRequest],
//         };
//       }
//     );
//   };
//   useEffect(() => {
//     console.log("subscribing to socket events");
//     socket.on("matchRequest", handleNewMatchRequest);

//     socket.on("newChat", handleNewChat);

//     return () => {
//       console.log("unsubscribing from socket events");
//       socket.off("matchRequest", handleNewMatchRequest);
//       socket.off("newChat", handleNewChat);
//     };
//   }
//   ), [];
// };

// export function ChatToastContent({ chatId }: { chatId: string }) {
//   return (
//     <View style={[mt.w("full"), mt.px(4)]}>
//       <View
//         style={[
//           mt.w("full"),
//           mt.bg("blackOpacity", 100, 0.9),
//           mt.p(2),
//           mt.flexCol,
//           mt.items("center"),
//           mt.justify("flex-start"),
//           mt.rounded("md"),
//           mt.glow("md", "green"),
//         ]}
//       >
//         <Text style={[mt.color("white")]}>You have a new match!</Text>
//         <Link href={`/chat/${chatId}`}>
//           <Text size="xl" style={[mt.color("green"), mt.underline]}>
//             Go to chat
//           </Text>
//         </Link>
//       </View>
//     </View>
//   );
// }

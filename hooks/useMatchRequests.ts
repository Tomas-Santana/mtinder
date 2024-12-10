import MatchController from "@/api/controllers/MatchController";
import socket from "@/api/controllers/SocketController";
import { MatchRequest } from "@/types/MatchRequest";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDefaultStore } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import type { GetMatchRequestsResponse } from "@/types/api/GetMatchRequests";
import { useEffect } from "react";

export const useMatchRequests = () => {
  const matchRequestsQuery = useQuery({
    queryFn: MatchController.getMatchRequests,
    queryKey: ["matchRequests"],
  });
  const queryClient = useQueryClient();

  const user = getDefaultStore().get(userAtom);

  useEffect(() => {
    const handleNewMatchRequest = (newMatchRequest: MatchRequest) => {
      const oldRequests = queryClient.getQueryData<GetMatchRequestsResponse>([
        "matchRequests",
      ]);

      if (
        !!oldRequests?.requests?.some(
          (req) => req.from === newMatchRequest.from
        )
      ) {
        return;
      }

      console.log(`I, ${user?.email} got a new matchRequest`, newMatchRequest);
      queryClient.setQueryData<GetMatchRequestsResponse>(
        ["matchRequests"],
        (data) => {
          return {
            requests: [...(data?.requests || []), newMatchRequest],
          };
        }
      );
    };

    socket.on("matchRequest", handleNewMatchRequest);

    // Cleanup the event listener on component unmount or when dependencies change
    return () => {
      socket.off("matchRequest", handleNewMatchRequest);
    };
  }, [queryClient, user]);

  return matchRequestsQuery;
};

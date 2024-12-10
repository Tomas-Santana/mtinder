import MatchController from "@/api/controllers/MatchController";
import { useQuery } from "@tanstack/react-query";

export const useMatchRequests = () => {
  const matchRequestsQuery = useQuery({
    queryFn: MatchController.getMatchRequests,
    queryKey: ["matchRequests"],
  });
  return matchRequestsQuery;
};

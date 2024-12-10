import { useMutation } from "@tanstack/react-query";
import MatchController from "@/api/controllers/MatchController";
import type { MatchRequest } from "@/types/MatchRequest";


export const useRequestMatch = ({
  setOpenMatchDialog,
  setMatchChatId,
  matchRequests
} : {
  setOpenMatchDialog: (value: boolean) => void;
  setMatchChatId: (value: string) => void;
  matchRequests?: MatchRequest[];
}) => {

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
    const hasRequestedMe = !!matchRequests?.some(
      (req) => req.from === variables.userId
    );
    if (hasRequestedMe) {
      setOpenMatchDialog(true);
      return;
    }
  },
});

return requestMatch
}

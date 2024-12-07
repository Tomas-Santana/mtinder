import { useQuery } from "@tanstack/react-query";
import AuthController from "@/api/controllers/AuthController";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: AuthController.me,
  });
};

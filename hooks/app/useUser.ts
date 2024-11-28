import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import UserController from '@/api/controllers/UserController';
import { userAtom } from '@/utils/atoms/userAtom';
import { User } from '@/types/User';

export function useUser(
  user: User | undefined,
  setUser: (user: User) => void
) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useAtom(userAtom);

  const updateUserMutation = useMutation({
    mutationFn: UserController.UpdateUser,
    onSuccess: (data) => {
      console.log("User updated")
      if(user && data.firstName && data.lastName){
        const udpdatedUser = {
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
        }
        setUser(udpdatedUser);
        setCurrentUser(udpdatedUser);
      }
      queryClient.setQueryData(['user'], (prevUser) => ({
        ...(prevUser || {}),
        firstName: data.firstName,
        lastName: data.lastName,
      }));
    },
    onError: (error) => {
      console.log(error.message)
    },
  });

  const updateUser = (userData: { firstName: string; lastName: string }) => {
    if (user?._id) {
      const payload = {
        _id: user._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      updateUserMutation.mutate(payload);
    }
  };

  return { currentUser: user, updateUser };
}
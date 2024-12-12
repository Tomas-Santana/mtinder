import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import UserController from '@/api/controllers/UserController';
import { userAtom } from '@/utils/atoms/userAtom';
import { User } from '@/types/User';
import { Toast } from '@/components/ui/toast';

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
      // Toast.success("User updated")
      if(user && data.firstName && data.lastName){
        const udpdatedUser = {
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          favoriteGenres: data.favoriteGenres
        }
        setUser(udpdatedUser);
        setCurrentUser(udpdatedUser);
      }
      queryClient.setQueryData(['user'], (prevUser: User) => ({
        ...(prevUser || {}),
        firstName: data.firstName,
        lastName: data.lastName,
        favoriteGenres: data.favoriteGenres,
      }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.log(error.message)
      // Toast.error(error.message)
    },

  });

  const updateUser = (userData: { firstName: string; lastName: string; genres: string[] }) => {
    if (user?._id) {
      const payload = {
        _id: user._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        favoriteGenres: userData.genres,
      };
      updateUserMutation.mutate(payload);
    }
  };

  return { currentUser: user, updateUser };
}
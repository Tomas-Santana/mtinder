import PhotosController from "@/api/controllers/PhotosController";
import { useAtom } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export const useMutateProfilePic = () => {
  const [currentUser, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();

  if (!currentUser) {
    throw new Error("User not found");
  }

  const deleteMutation = useMutation({
    mutationFn: PhotosController.deleteProfilePic,
    onMutate: async (request) => {
      const previousImages = currentUser?.imageUrls;
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrls: currentUser?.imageUrls?.filter(
            (url) => url !== request.url
          ),
        };
      });
      return { previousImages };
    },
    onError(error, variables, context) {
      if (!context?.previousImages) return;
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrls: context.previousImages,
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const principalMutation = useMutation({
    mutationFn: PhotosController.principalProfilePic,
    onMutate: async (request) => {
      const index = request.index;
      // get the image at index
      const previousImages = currentUser?.imageUrls;
      const image = previousImages?.[index];
      if (!image) {
        throw new Error("Invalid index");
      }
      // move the image to the front of the array
      const newImages = [
        image,
        ...(previousImages?.filter((url) => url !== image) || []),
      ];

      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrls: newImages,
        };
      });

    },
  })

  return { deleteMutation, principalMutation };
};

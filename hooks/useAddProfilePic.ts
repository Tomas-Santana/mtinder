import { useMutation } from "@tanstack/react-query";
import PhotosController from "@/api/controllers/PhotosController";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
import { Toast } from "@/components/ui/toast";

export function useAddProfilePic() {
  const queryClient = useQueryClient();
  const [currentUser, setUser] = useAtom(userAtom);

  return useMutation(
    {
      mutationFn: PhotosController.addProfilePic,
      onMutate: () => {
        // Toast.info("Uploading profile picture...");
        console.log("Uploading profile picture...")
      },
      onSuccess: (data) => {
        if (data.error) {
          // Toast.error(data.error);
          console.log(data.error)
          return;
        }
        if (!data.url) return;
        if (!currentUser) return;
        setUser({
          ...currentUser,
          imageUrls: [data.url, ...(currentUser?.imageUrls ?? [])],
        });
        queryClient.invalidateQueries({queryKey: ["user"]});
        // Toast.success("Profile picture uploaded successfully");
        console.log("Profile picture uploaded successfully")
      }
    }
  )
}
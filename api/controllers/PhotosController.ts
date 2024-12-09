import { SuperFetchError, superFetch } from "./superfetch/superFetch";
import {
  CompleteProfileRequest,
  completeProfileResponse,
  CompleteProfileResponse,
} from "@/types/api/UploadImages";
import { getDefaultStore } from "jotai";
import { userAtom } from "@/utils/atoms/userAtom";
const store = getDefaultStore();


export default class PhotosController {
  static async uploadImages(
    request: CompleteProfileRequest
  ): Promise<CompleteProfileResponse> {
    try {
      const res = await superFetch<
        CompleteProfileRequest,
        CompleteProfileResponse
      >({
        options: {
          includeCredentials: true,
          method: "POST",
        },
        route: "uploadImages",
        responseSchema: completeProfileResponse,
        payload: request,
      });
      if (!res) {
        throw new Error("error uploading images");
      }
      const currentUser = store.get(userAtom);
      if (!currentUser || !currentUser._id) {
        throw new Error("User ID is missing");
      }
      store.set(userAtom, {
        ...currentUser,
        imageUrls: res.imageUrls,
        favoriteGenres: request.genres,
        profileReady: true,
      });
      return res;
    } catch (error) {
      if (error instanceof SuperFetchError) {
        if (error.code === 400) {
          throw new Error("Invalid image data");
        }
      }
      console.log(error);
      throw new Error("error uploading images");
    }
  }
}

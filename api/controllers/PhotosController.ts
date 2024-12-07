import { SuperFetchError, superFetch } from "./superfetch/superFetch";
import {
  CompleteProfileRequest,
  completeProfileResponse,
  CompleteProfileResponse,
} from "@/types/api/UploadImages";

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

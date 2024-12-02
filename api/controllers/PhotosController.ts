import { SuperFetchError, superFetch } from "./superFetch";
import {
  UploadImagesRequest,
  uploadImagesResponse,
  UploadImagesResponse
} from "@/types/api/UploadImages";

export default class PhotosController {
  static async uploadImages(
    payload: UploadImagesRequest
  ): Promise<UploadImagesResponse> {
    try {
      const res = await superFetch<UploadImagesRequest, UploadImagesResponse>({
        options: {
          method: "POST",
          includeCredentials: true,
        },
        route: "uploadImages",
        responseSchema: uploadImagesResponse,
        payload,
      });
      return res;
    } catch (error) {
      if (error instanceof SuperFetchError) {
        if (error.code === 400) {
          throw new Error("Invalid image data");
        }
      }
      throw new Error("error uploading images");
    }
  }
}

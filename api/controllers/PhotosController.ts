import { SuperFetchError, superFetch } from "./superfetch/superFetch";
import {
  CompleteProfileRequest,
  completeProfileResponse,
  CompleteProfileResponse,
} from "@/types/api/UploadImages";
import {
  DeleteProfilePic,
  DeleteProfilePicResponse,
  deleteProfilePicResponse,
} from "@/types/api/DeleteProfilePic";
import {
  AddProfilePic,
  addProfilePicResponse,
  AddProfilePicResponse,
} from "@/types/api/AddProfilePic";
import {
  PrincipalProfilePic,
  PrincipalProfilePicResponse,
  principalProfilePicResponse,
} from "@/types/api/PrincipalProfilePic";
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

  static async deleteProfilePic(
    request: DeleteProfilePic
  ): Promise<DeleteProfilePicResponse> {
    try {
      const res = await superFetch<DeleteProfilePic, DeleteProfilePicResponse>({
        options: {
          includeCredentials: true,
          method: "POST",
        },
        route: "deleteProfilePic",
        responseSchema: deleteProfilePicResponse,
        payload: request,
      });
      if (!res) {
        throw new Error("error deleting profile pic");
      }
      return res;
    } catch (error) {
      throw new Error("error deleting profile pic");
    }
  }

  static async addProfilePic(
    request: AddProfilePic
  ): Promise<AddProfilePicResponse> {
    try {
      const res = await superFetch<AddProfilePic, AddProfilePicResponse>({
        options: {
          includeCredentials: true,
          method: "POST",
        },
        route: "addProfilePic",
        responseSchema: addProfilePicResponse,
        payload: request,
      });
      if (!res) {
        throw new Error("error adding profile pic");
      }

      return res;
    } catch (error) {
      throw new Error("error adding profile pic");
    }
  }

  static async principalProfilePic(
    request: PrincipalProfilePic
  ): Promise<PrincipalProfilePicResponse> {
    try {
      const res = await superFetch<PrincipalProfilePic, PrincipalProfilePicResponse>({
        options: {
          includeCredentials: true,
          method: "POST",
        },
        route: "principalProfilePic",
        responseSchema: principalProfilePicResponse,
        payload: request,
      });
      if (!res) {
        throw new Error("error getting principal profile pic");
      }

      return res;
    } catch (error) {
      throw new Error("error getting principal profile pic");
    }
  }
}

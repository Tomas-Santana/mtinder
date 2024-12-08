import { User } from "@/types/User";
import { superFetch, SuperFetchError } from "./superfetch/superFetch";
import {
  getUserResponse, getUserSchema, UserDeleteRequest,
  UserDeleteResponse,
  UserDeleteSchema,
  UserUpdateRequest,
  UserUpdateResponse,
  UserUpdateSchema,
} from "@/types/api/UserRequest";

export default class UserController {

  static async getUsers(): Promise<getUserResponse> {
    try {
      const res = await superFetch<null, getUserResponse, "user/all">({
        options: {
          method: "GET",
          includeCredentials: true,
        },
        route: "user/all",
        routeParams: [],
        responseSchema: getUserSchema,
      });
      return res;
    } catch (error) {
      if (error instanceof SuperFetchError) {
        if (error.code === 404) {
          throw new Error("User not found");
        }
      }
      console.log(error)
      throw new Error("error fetching user")
    }
  }
  static async UpdateUser(
    payload: UserUpdateRequest
  ): Promise<UserUpdateResponse> {
    console.log("myPayload", payload);
    try {
      const res = await superFetch<
        UserUpdateRequest,
        UserUpdateResponse,
        "user/[id]"
      >({
        options: {
          method: "PUT",
          includeCredentials: true,
        },
        route: "user/[id]",
        routeParams: [payload._id],
        responseSchema: UserUpdateSchema,
        payload,
      });
      return res;
    } catch (error) {
      if (error instanceof SuperFetchError) {
        if (error.code === 400) {
          throw new Error("Invalid user data");
        }
      }
      console.log(error);
      throw new Error("error updating user");
    }
  }

  static async DeleteUser(
    payload: UserDeleteRequest
  ): Promise<UserDeleteResponse> {
    console.log(payload);

    try {
      if (!payload._id) throw new Error("User Id required");
      const res = await superFetch<UserDeleteRequest, UserDeleteResponse>({
        options: {
          method: "DELETE",
          includeCredentials: true,
        },
        route: "user/[id]",
        routeParams: [payload._id],
        responseSchema: UserDeleteSchema,
        payload,
      });
      return res;
    } catch (error) {
      if (error instanceof SuperFetchError) {
        if (error.code === 400) {
          throw new Error("Invalid user ID");
        }
      }
      throw new Error("error deleting user");
    }
  }
}

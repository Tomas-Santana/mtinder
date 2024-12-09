import {
  RequestMatch,
  RequestMatchResponse,
  requestMatchResponseSchema,
  requestMatchSchema,
} from "@/types/api/requestMatch";

import { superFetch } from "./superfetch/superFetch";

export default class MatchController {
  static async requestMatch(payload: RequestMatch): Promise<RequestMatchResponse> {
    try {
      const res = await superFetch<RequestMatch, RequestMatchResponse, "match/request">({
        options: {
          method: "POST",
          includeCredentials: true,
        },
        route: "match/request",
        routeParams: [],
        responseSchema: requestMatchResponseSchema,
        payload,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new Error("error requesting match");
    }
  }
}

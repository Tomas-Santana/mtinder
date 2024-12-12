import { RequestMatch, RequestMatchResponse, requestMatchResponseSchema } from "@/types/api/requestMatch";
import { getMatchRequestResponseSchema, GetMatchRequestsResponse  } from "@/types/api/GetMatchRequests";


import { superFetch } from "./superfetch/superFetch";

export default class MatchController {
  static async requestMatch(
    payload: RequestMatch
  ): Promise<RequestMatchResponse> {
    try {
      const res = await superFetch<
        RequestMatch,
        RequestMatchResponse,
        "match/request"
      >({
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

  static async getMatchRequests(): Promise<GetMatchRequestsResponse> {
    try {
      const res = await superFetch<undefined, GetMatchRequestsResponse, "match">({
        options: {
          method: "GET",
          includeCredentials: true,
        },
        route: "match",
        routeParams: [],
        responseSchema: getMatchRequestResponseSchema,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw new Error("error getting match requests");
    }
  }
}

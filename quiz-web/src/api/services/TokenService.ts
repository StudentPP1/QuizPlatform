import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_NAME,
  API_BASE_URL,
} from "../../constants/constants";
import { globalCache } from "../../hooks/useCachedFetch";
import { fetchErrorEvent } from "../utils/ErrorHandler";
import { HttpMethod } from "../utils/HttpMethod";
import { RequestAttributes } from "../utils/RequestAttributes";

export async function refreshToken() {
  return await fetch(
    `${API_BASE_URL}/api/token/update`,
    RequestAttributes.builder().setMethod(HttpMethod.POST).build()
  ).then(async (result) => {
    const token = await result.json();
    if (!result.ok) {
      globalCache.delete(ACCESS_TOKEN_NAME);
      fetchErrorEvent.dispatchEvent(
        new CustomEvent("api-fetch-error", {
          detail: { status: result.status, messages: token.message },
        })
      );
    } else {
      globalCache.set(ACCESS_TOKEN_NAME, {
        data: token.accessToken,
        timestamp: Number(ACCESS_TOKEN_EXPIRATION) + Date.now(),
      });
      console.log("globalCache: ", globalCache);
    }
  });
}

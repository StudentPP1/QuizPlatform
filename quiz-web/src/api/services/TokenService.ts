import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/constants";
import { fetchErrorEvent } from "../utils/ErrorHandler";
import { RequestAttributes } from "../utils/RequestAttributes";

export async function refreshToken() {
  return await fetch(
    `${API_BASE_URL}/api/token/update`,
    RequestAttributes.builder().setMethod("POST").build()
  ).then(async (result) => {
    const token = await result.json();
    if (!result.ok) {
      sessionStorage.clear();
      fetchErrorEvent.dispatchEvent(
        new CustomEvent("api-fetch-error", {
          detail: { status: result.status, messages: token.message },
        })
      );
    } else {
      sessionStorage.setItem(ACCESS_TOKEN_NAME, token.accessToken);
    }
  });
}
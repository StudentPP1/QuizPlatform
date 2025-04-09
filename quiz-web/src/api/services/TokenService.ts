import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../constants/constants";
import { RequestAttributes } from "../utils/RequestAttributes";

export async function refreshToken() {
  return await fetch(
    `${API_BASE_URL}/api/token/update`,
    RequestAttributes.builder().setMethod("POST").build()
  )
    .then(async (result) => {
      const token = await result.json();
      console.dir(token);
      sessionStorage.setItem(ACCESS_TOKEN_NAME, token.accessToken);
    })
    .catch(() => {
      sessionStorage.clear();
    });
}

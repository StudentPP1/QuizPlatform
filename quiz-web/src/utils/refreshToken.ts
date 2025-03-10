import { ACCESS_TOKEN_NAME, API_BASE_URL, RequestAttributes } from "../constants/constants";

export async function refreshToken() {
  await fetch(
    `${API_BASE_URL}/auth/refresh-token`,
    RequestAttributes.builder().build()
  )
    .then(async (result) => {
      const token = await result.json();
      sessionStorage.setItem(ACCESS_TOKEN_NAME, token.access_token);
    })
    .catch(() => {
      sessionStorage.clear();
    });
}

import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../constants/constants";
import { RequestAttributes } from "./utils/ApiUtils";

export class TokenService {
  static async refreshToken() {
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
}

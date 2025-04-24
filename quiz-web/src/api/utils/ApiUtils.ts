import { API_BASE_URL } from "../../constants/constants";
import { refreshToken } from "../services/TokenService";
import { fetchErrorEvent } from "./ErrorHandler";

// TODO: Task 8 => create Proxy (if error => refreshToken() => retry)
export async function apiFetch<T>(
  url: string,
  attributes: RequestInit,
  retry: boolean = true
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, attributes);
  const json = await response.json();
  const status = response.status;

  if (!response.ok) {
    if (retry && (status === 401 || status === 403)) {
      try {
        console.log("Token expired, refreshing...");
        await refreshToken(); // оновлення токена
        return apiFetch<T>(url, attributes, false); // повтор без циклів
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
      }
    }

    // Викидаємо евент
    fetchErrorEvent.dispatchEvent(
      new CustomEvent("api-fetch-error", {
        detail: { status, messages: json.message },
      })
    );

    throw new Error(json.message || "API request failed");
  }

  return json as T;
}

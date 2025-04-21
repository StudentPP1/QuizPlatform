import { API_BASE_URL } from "../../constants/constants";
import { fetchErrorEvent } from "./ErrorHandler";

export async function apiFetch<T>(
  url: string,
  attributes: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, attributes);
  const json = await response.json();
  if (!response.ok) {
    fetchErrorEvent.dispatchEvent(
      new CustomEvent("api-fetch-error", {
        detail: { status: response.status, messages: json.message },
      })
    );
  }
  return json as T;
}
import { API_BASE_URL } from "../../constants/constants";
import { refreshToken } from "../services/TokenService";
import { fetchErrorEvent } from "./ErrorHandler";

// TODO: Task 8 => create Proxy (if error => refreshToken() => retry)
class ApiError {
  status: number;
  messages: string[] | string;

  constructor(status: number, messages: string[] | string) {
    this.status = status;
    this.messages = messages;
  }
}

interface Fetcher {
  apiFetch<T>(url: string, attributes: RequestInit): Promise<T>;
}

class ApiFetcher implements Fetcher {
  async apiFetch<T>(url: string, attributes: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, attributes);
    const json = await response.json();
    const status = response.status;

    if (!response.ok) {
      const details = { status, messages: json.message };
      fetchErrorEvent.dispatchEvent(
        new CustomEvent("api-fetch-error", {
          detail: details,
        })
      );
      throw details as ApiError;
    }

    return json as T;
  }
}

class ApiFetcherProxy implements Fetcher {
  private apiFetching: ApiFetcher = new ApiFetcher();

  async apiFetch<T>(url: string, attributes: RequestInit): Promise<T> {
    try {
      return await this.apiFetching.apiFetch<T>(url, attributes);
    } catch (error) {
      // if token is not valid => return 401 status
      if (error instanceof ApiError && error.status === 401) {
        await refreshToken();
        return this.apiFetching.apiFetch<T>(url, attributes);
      }
      throw error;
    }
  }
}

export async function apiFetch<T>(
  url: string,
  attributes: RequestInit
): Promise<T> {
  const fetcher: Fetcher = new ApiFetcherProxy();
  return fetcher.apiFetch(url, attributes);
}

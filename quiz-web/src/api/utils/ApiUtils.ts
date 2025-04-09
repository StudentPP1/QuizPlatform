import { API_BASE_URL } from "../../constants/constants";
import { defaultErrorHandler } from "./ErrorHandler";

export async function apiFetch(
  url: string,
  attributes: RequestInit
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${url}`, attributes);
  const json = await response.json();
  if (response.status !== 200) {
    console.log("Error: " + json.message);
    defaultErrorHandler(json.message);
    throw json;
  } 
  return json;
}
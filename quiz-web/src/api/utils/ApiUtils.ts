import { API_BASE_URL } from "../../constants/constants";

export async function fetch(
  url: string,
  attributes: RequestInit
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${url}`, attributes);
  if (response.statusCode !== 200) {
    throw Error(response.message); // ! send reject promise event
  }
  const json = await response.json();
  return json;
}

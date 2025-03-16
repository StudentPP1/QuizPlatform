import { toast } from "react-toastify";
import { API_BASE_URL } from "../../constants/constants";

export class ApiWrapper {
  static async call(func: Function, callback: Function, args?: any) {
    await func(...args).then((result: any) => {
      if (result.hasOwnProperty("statusCode")) {
        const errorMessages: string | string[] = result.message;
        if (!Array.isArray(errorMessages)) {
          toast.error(result.message, { position: "top-right" });
        } else {
          for (const message of errorMessages) {
            toast.error(message, { position: "top-right" });
          }
        }
      } else {
        callback(result);
      }
    });
  }

  static async fetch(url: string, attributes: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${url}`, attributes);
    const json = await response.json();
    return json;
  }
}

import { toast } from "react-toastify";
import { API_BASE_URL } from "../../constants/constants";

export class ApiWrapper {
  static apiErrorHandling = ApiWrapper.defaultErrorHandling;

  private static defaultErrorHandling(errorMessages: string | string[]) {
    if (!Array.isArray(errorMessages)) {
      toast.error(errorMessages, { position: "top-right" });
    } else {
      for (const message of errorMessages) {
        toast.error(message, { position: "top-right" });
      }
    }
  }

  static async call(
    func: Function,
    callback: Function,
    args?: any,
    errorHandling: Function = this.apiErrorHandling
  ) {
    await func(...args).then((result: any) => {
      if (result.hasOwnProperty("statusCode")) {
        errorHandling(result.message);
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

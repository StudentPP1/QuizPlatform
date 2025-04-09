import { toast } from "react-toastify";

export function defaultErrorHandler(errorMessages: string | string[]) {
  if (!Array.isArray(errorMessages)) {
    toast.error(errorMessages, { position: "top-right" });
  } else {
    for (const message of errorMessages) {
      toast.error(message, { position: "top-right" });
    }
  }
}
// TODO: Task 7 (maybe these is implementing of event listeners for errors)
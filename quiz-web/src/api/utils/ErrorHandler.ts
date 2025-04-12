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
export const fetchErrorEvent = new EventTarget();
function onApiFetchError(listener: (event: CustomEvent) => void) {
  fetchErrorEvent.addEventListener(
    "api-fetch-error",
    listener as EventListener
  );
}
onApiFetchError((event) => {
  console.error("API Fetch Error:", event.detail);
  defaultErrorHandler(event.detail.messages);
});

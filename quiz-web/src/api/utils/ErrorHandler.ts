import { toast } from "react-toastify";

// TODO: + Task 7 => create a custom error handler for API error event
function defaultErrorHandler(errorMessages: string | string[]) {
  if (!Array.isArray(errorMessages)) {
    toast.error(errorMessages, { position: "top-right" });
  } else {
    for (const message of errorMessages) {
      toast.error(message, { position: "top-right" });
    }
  }
}

export const fetchErrorEvent = new EventTarget();

// for event by name "api-fetch-error" set the listener
function onApiFetchError(listener: (event: CustomEvent) => void) {
  fetchErrorEvent.addEventListener("api-fetch-error", listener as EventListener);
}

// add listener to the event
onApiFetchError((event) => {
  console.error("API Fetch Error:", event.detail);
  defaultErrorHandler(event.detail.messages);
});
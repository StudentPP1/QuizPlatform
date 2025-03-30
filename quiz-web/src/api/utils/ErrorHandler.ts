import { toast } from "react-toastify";

function defaultErrorHandler(errorMessages: string | string[]) {
  if (!Array.isArray(errorMessages)) {
    toast.error(errorMessages, { position: "top-right" });
  } else {
    for (const message of errorMessages) {
      toast.error(message, { position: "top-right" });
    }
  }
}

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled error:", event.reason);
  defaultErrorHandler(event.reason.message);
});

window.addEventListener("error", (event) => {
  console.error("Fatal error:", event.error);
  defaultErrorHandler(event.error.message);
});

enum LogLevel {
  TRACE = "TRACE",
  DEBUG = "DEBUG",
  INFO = "INFO",
  ERROR = "ERROR",
}

export function log(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
): TypedPropertyDescriptor<any> | void {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const time = () => `${(performance.now() - start).toFixed(2)}ms`;

    const logMessage = (type: LogLevel, text: any, showTime = false) => {
      console.log(
        `[${type}] | ${String(propertyKey)} | ${text} | ${
          showTime ? time() : ""
        }`
      );
    };

    try {
      logMessage(LogLevel.INFO, "Entering method.");
      const result = originalMethod.apply(this, args);

      // Handle async functions too
      if (result instanceof Promise) {
        return result
          .then((res: any) => {
            logMessage(LogLevel.INFO, "Exiting method.", true);
            return res;
          })
          .catch((err: any) => {
            logMessage(LogLevel.ERROR, err.message || err, true);
            throw err;
          });
      }

      logMessage(LogLevel.INFO, "Exiting method.", true);
      return result;
    } catch (error: any) {
      logMessage(LogLevel.ERROR, error.message || error, true);
      throw error;
    }
  };

  return descriptor;
}

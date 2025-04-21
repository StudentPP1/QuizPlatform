export class AsyncFunctionQueue {
  private queue: { fn: Function; catchFn?: Function }[] = [];
  private isProcessing: boolean = false;
  private lastResult: any = undefined;

  enqueue(fn: Function, catchFn?: Function) {
    this.queue.push({ fn, catchFn });
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { fn, catchFn } = this.queue.shift()!;

      try {
        const result = await fn(this.lastResult);
        this.lastResult = result;
      } catch (error) {
        this.lastResult = undefined;
        if (catchFn) {
          catchFn(error);
        } else {
          console.error("Unhandled queue error:", error);
        }
      }
    }

    this.isProcessing = false;
  }
}

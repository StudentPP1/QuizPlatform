export class AsyncFunctionQueue {
  private queue: { fn: Function; catchFn?: Function }[] = [];
  private isProcessing: boolean = false;
  private lastResult: any = undefined;

  enqueue(fn: Function, catchFn?: Function) {
    this.queue.push({ fn, catchFn });
    this.processQueue();
  }

  private async processQueue() {
    // Prevent re-entrance and check if the queue is empty
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    // if during execution fn, other fn is added to the queue, we need to process it
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

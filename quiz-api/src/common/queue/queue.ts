import { InternalServerErrorException } from '@nestjs/common';

type Task<T = any> = () => Promise<T>;

export class Queue {
  private queue: Task[] = [];
  private activeTasks = 0;
  private readonly maxConcurrentTasks: number;
  private readonly delayBetweenQueriesMs: number;

  constructor(maxConcurrentTasks: number, delayBetweenQueriesMs: number) {
    this.maxConcurrentTasks = maxConcurrentTasks;
    this.delayBetweenQueriesMs = delayBetweenQueriesMs;
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(new InternalServerErrorException(err));
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (
      this.activeTasks >= this.maxConcurrentTasks ||
      this.queue.length === 0
    ) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.activeTasks++;

    try {
      await task();
    } finally {
      this.activeTasks--;

      if (this.delayBetweenQueriesMs > 0) {
        await this.delay(this.delayBetweenQueriesMs);
      }

      this.processQueue();
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

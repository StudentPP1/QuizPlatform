import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type QueryTask<T = any> = () => Promise<T>;

@Injectable()
export class QueryQueueService {
  private queue: QueryTask[] = [];
  private activeTasks = 0;
  private readonly maxConcurrentTasks: number;
  private readonly delayBetweenQueriesMs: number;

  constructor(configService: ConfigService) {
    this.maxConcurrentTasks = configService.get<number>(
      'QUERY_QUEUE_CONCURRENCY',
      2,
    );
    this.delayBetweenQueriesMs = configService.get<number>(
      'QUERY_QUEUE_DELAY_MS',
      0,
    );
  }

  enqueue<T>(task: QueryTask<T>): Promise<T> {
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

import { Global, Module } from '@nestjs/common';

import { QueryQueueService } from '@queue/query-queue.service';

@Global()
@Module({
  providers: [QueryQueueService],
  exports: [QueryQueueService],
})
export class QueryQueueModule {}

import { Global, Module } from '@nestjs/common';

import { DATA_SOURCE } from '@common/constants/repository.constants';
import { AppDataSource } from '@database/dataSource';

@Global()
@Module({
  providers: [
    {
      provide: DATA_SOURCE,
      useFactory: async () => {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        return AppDataSource;
      },
    },
  ],
  exports: [DATA_SOURCE],
})
export class DatabaseModule {}

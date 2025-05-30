import { Module } from '@nestjs/common';

import {
  BASE_STORAGE_SERVICE,
  STORAGE_SERVICE,
} from '@common/constants/storage.constants';
import { IStorageService } from '@common/contracts/services/storage.service.contract';
import { CloudinaryProvider } from '@storage/cloudinary.provider';
import { LoggingStorageDecorator } from '@storage/logging-storage.decorator';
import { CloudinaryService } from '@storage/storage.service';

@Module({
  providers: [
    CloudinaryProvider,
    { provide: BASE_STORAGE_SERVICE, useClass: CloudinaryService },
    {
      provide: STORAGE_SERVICE,
      useFactory: (baseService: IStorageService) =>
        new LoggingStorageDecorator(baseService),
      inject: [BASE_STORAGE_SERVICE],
    },
  ],
  exports: [STORAGE_SERVICE, CloudinaryProvider],
})
export class StorageModule {}

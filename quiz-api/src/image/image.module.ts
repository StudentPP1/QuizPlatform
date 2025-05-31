import { Module } from '@nestjs/common';

import {
  BASE_IMAGE_SERVICE,
  IMAGE_SERVICE,
} from '@common/constants/service.constants';
import { IImageService } from '@common/contracts/services/image.service.contract';
import { ImageService } from '@image/image.service';
import { LoggingImageDecorator } from '@image/logging-image.decorator';
import { StorageModule } from '@storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [
    { provide: BASE_IMAGE_SERVICE, useClass: ImageService },
    {
      provide: IMAGE_SERVICE,
      useFactory: (baseService: IImageService) =>
        new LoggingImageDecorator(baseService),
      inject: [BASE_IMAGE_SERVICE],
    },
  ],
  exports: [IMAGE_SERVICE],
})
export class ImageModule {}

import { IStorageService } from '@common/contracts/services/storage.service.contract';
import { UploadedImage } from '@common/interfaces/uploaded-image.interface';
import { baseLogger } from '@common/logging/logger';

export class LoggingStorageDecorator implements IStorageService {
  private readonly logger = baseLogger.child({ service: 'Storage Service' });

  constructor(private readonly wrapped: IStorageService) {}

  private async logMethod<T>(
    methodName: string,
    args: unknown[],
    fn: () => Promise<T>,
  ): Promise<T> {
    this.logger.info(
      `Called ${methodName}(${args.map((arg) => JSON.stringify(arg)).join(', ')})`,
    );
    const start = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.logger.info(`Method ${methodName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error(
        `Method ${methodName} failed: ${error instanceof Error ? error.message : error}`,
      );
      throw error;
    }
  }

  uploadImage(buffer: Buffer): Promise<UploadedImage> {
    return this.logMethod(this.uploadImage.name, [typeof buffer], () =>
      this.wrapped.uploadImage(buffer),
    );
  }

  deleteImage(publicId: string): Promise<void> {
    return this.logMethod(this.deleteImage.name, [publicId], () =>
      this.wrapped.deleteImage(publicId),
    );
  }
}

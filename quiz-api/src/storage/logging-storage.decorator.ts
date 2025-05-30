import { UploadApiResponse } from 'cloudinary';

import { IStorageService } from '@common/contracts/services/storage.service.contract';
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

  uploadTaskImage(buffer: Buffer): Promise<UploadApiResponse> {
    return this.logMethod(this.uploadTaskImage.name, [typeof buffer], () =>
      this.wrapped.uploadTaskImage(buffer),
    );
  }

  deleteTaskImage(publicId: string): Promise<void> {
    return this.logMethod(this.deleteTaskImage.name, [publicId], () =>
      this.wrapped.deleteTaskImage(publicId),
    );
  }
}

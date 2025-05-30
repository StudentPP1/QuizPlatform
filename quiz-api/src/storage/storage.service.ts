import { Readable } from 'stream';

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { v4 as uuid } from 'uuid';

import { IStorageService } from '@common/contracts/services/storage.service.contract';

@Injectable()
export class CloudinaryService implements IStorageService {
  async uploadTaskImage(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'quiz-images',
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error as Error);
          resolve(result);
        },
      );
      Readable.from(buffer).pipe(stream);
    });
  }

  async deleteTaskImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

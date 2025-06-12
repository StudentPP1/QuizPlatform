import { Readable } from 'stream';

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';

import { IStorageService } from '@common/contracts/services/storage.service.contract';
import { UploadedImage } from '@common/interfaces/uploaded-image.interface';

@Injectable()
export class CloudinaryService implements IStorageService {
  async uploadImage(buffer: Buffer): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'quiz-images',
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error as Error);
          resolve({
            url: result?.secure_url ?? '',
            public_id: result?.public_id ?? '',
          });
        },
      );
      Readable.from(buffer).pipe(stream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

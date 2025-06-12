import { UploadedImage } from '@common/interfaces/uploaded-image.interface';

export interface IStorageService {
  uploadImage(buffer: Buffer): Promise<UploadedImage>;
  deleteImage(publicId: string): Promise<void>;
}

import { UploadApiResponse } from 'cloudinary';

export interface IStorageService {
  uploadTaskImage(buffer: Buffer): Promise<UploadApiResponse>;

  deleteTaskImage(publicId: string): Promise<void>;
}

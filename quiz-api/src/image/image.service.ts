import { Inject, Injectable } from '@nestjs/common';

import { STORAGE_SERVICE } from '@common/constants/service.constants';
import { IImageService } from '@common/contracts/services/image.service.contract';
import { IStorageService } from '@common/contracts/services/storage.service.contract';
import { Task } from '@database/entities/task.entity';

@Injectable()
export class ImageService implements IImageService {
  constructor(
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async attachImagesToTasks<T extends Partial<Task>>(
    tasks: T[],
    files: Express.Multer.File[],
  ): Promise<T[]> {
    const uploadTasks = files.map(async (file) => {
      const match = file.fieldname.match(/images\[(\d+)\]/);
      const index = match ? parseInt(match[1], 10) : -1;
      if (index >= 0 && tasks[index]) {
        const { url, public_id } = await this.storageService.uploadImage(
          file.buffer,
        );
        Object.assign(tasks[index], { image: url, publicId: public_id });
      }
    });

    await Promise.all(uploadTasks);
    return tasks;
  }

  async deleteImagesFromTasks(tasks: Task[]): Promise<void> {
    const imagesTodelete = tasks
      .filter((task) => task.publicId)
      .map((task) => this.storageService.deleteImage(task.publicId));

    await Promise.all(imagesTodelete);
  }
}

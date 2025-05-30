import { Inject, Injectable } from '@nestjs/common';

import { STORAGE_SERVICE } from '@common/constants/storage.constants';
import { IImageService } from '@common/contracts/services/image.service.contract';
import { IStorageService } from '@common/contracts/services/storage.service.contract';
import { Task } from '@task/entities/task.entity';

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
      if (match) {
        const index = parseInt(match[1], 10);
        if (tasks[index]) {
          const result = await this.storageService.uploadTaskImage(file.buffer);
          tasks[index].image = result.url;
          tasks[index].publicId = result.public_id;
        }
      }
    });

    await Promise.all(uploadTasks);
    return tasks;
  }

  async deleteImagesFromTasks(tasks: Task[]): Promise<void> {
    const imagesTodelete = tasks
      .filter((task) => task.publicId)
      .map(
        async (task) =>
          await this.storageService.deleteTaskImage(task.publicId),
      );

    await Promise.all(imagesTodelete);
  }
}

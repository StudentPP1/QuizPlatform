import { PartialType } from '@nestjs/mapped-types';

import { CreateTaskDto } from '@common/dto/create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

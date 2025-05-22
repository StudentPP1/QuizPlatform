import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';

import { TaskType } from '@common/enums/task-type.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsEnum(TaskType)
  type: TaskType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  correctAnswers?: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[] | null;

  @IsOptional()
  @IsString()
  image?: string | null;
}

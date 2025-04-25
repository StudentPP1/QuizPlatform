import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

import { CreateTaskDto } from '@task/dto/create-task.dto';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numberOfTasks: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(120)
  timeLimit: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}

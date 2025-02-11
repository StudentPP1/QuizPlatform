import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateTaskDto } from '../../task/dto/create-task.dto';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  numberOfTasks: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(3600)
  timeLimit: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}

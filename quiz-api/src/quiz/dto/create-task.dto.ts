import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateIf,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(['text', 'multiple-choice'])
  type: 'text' | 'multiple-choice';

  @IsOptional()
  @IsString()
  @ValidateIf((task) => task.type === 'text')
  correctAnswer?: string;

  @IsOptional()
  @IsArray()
  @ValidateIf((task) => task.type === 'multiple-choice')
  options?: string[];
}

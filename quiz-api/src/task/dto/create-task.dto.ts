import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsEnum(['text', 'single', 'multiple-choice'])
  type: 'text' | 'single' | 'multiple-choice';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  correctAnswer?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsUrl()
  image?: string;
}

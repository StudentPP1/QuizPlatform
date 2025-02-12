import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  quesion: string;

  @IsNotEmpty()
  @IsEnum(['text', 'multiple-choice'])
  type: 'text' | 'multiple-choice';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  correctAnswer?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}

import { Type } from 'class-transformer';
import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class BasePaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  from: number;

  @Type(() => Number)
  @IsInt()
  @Min(2)
  to: number;
}

export class QuizPaginationDto extends BasePaginationDto {
  @IsString()
  name: string;
}

export class ReviewPaginationDto extends BasePaginationDto {
  @IsUUID()
  quizId: string;
}

import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

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
  @IsUUID()
  name: string;
}

export class ReviewPaginationDto extends BasePaginationDto {
  @IsUUID()
  quizId: string;
}

import {
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  text?: string;
}

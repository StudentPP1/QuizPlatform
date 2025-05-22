import { IsNumber, Max, Min } from 'class-validator';

export class SaveQuizResultDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}

import { IsNumber, IsBoolean } from 'class-validator';

export class SaveQuizResultDto {
  @IsNumber()
  score: number;

  @IsBoolean()
  passed: boolean;
}

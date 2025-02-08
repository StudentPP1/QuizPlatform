import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateGoogleUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  googleId?: string;
}

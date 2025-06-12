import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateGoogleUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  googleId: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string | null;
}

import { IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
profileImage?: string;
}

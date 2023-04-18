import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Transform } from 'class-transformer'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(obj => obj.value.toLowerCase())
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}

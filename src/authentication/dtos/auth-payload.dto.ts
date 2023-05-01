import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class AuthPayloadDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

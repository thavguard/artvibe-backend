import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class JwtStrategyValidateDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

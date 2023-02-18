import { IsString } from "class-validator";

export class LoginResponseDto {
  @IsString()
  readonly access_token: string;
}

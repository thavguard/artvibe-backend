import { IsNumber, IsString } from "class-validator";

export class AuthResponse {
  @IsString()
  readonly access_token: string;

  @IsString()
  readonly refresh_token: string;

  @IsNumber()
  readonly userId: number;
}

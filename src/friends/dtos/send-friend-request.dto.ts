import { IsNotEmpty, IsNumber } from "class-validator";

export class SendFriendRequestDto {
  @IsNumber()
  @IsNotEmpty()
  public friendId: number;
}

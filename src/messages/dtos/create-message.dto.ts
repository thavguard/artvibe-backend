import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  messageRoomId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

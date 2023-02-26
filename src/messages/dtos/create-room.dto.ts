import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  public name: string;

  @IsArray()
  @IsNotEmpty()
  public userIds: number[];
}

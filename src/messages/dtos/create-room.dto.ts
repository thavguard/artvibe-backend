import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateRoomDto {
  @IsString()
  public name: string;

  @IsArray()
  @IsNotEmpty()
  public userIds: number[];

  @IsBoolean()
  public isPrivate: boolean;
}

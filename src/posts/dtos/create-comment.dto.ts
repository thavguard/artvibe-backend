import { IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  public text: string;
}

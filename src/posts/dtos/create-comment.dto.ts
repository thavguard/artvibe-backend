import { IsNotEmpty, IsString, Min } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @Min(10)
    @IsNotEmpty()
    public text: string
}
import { BadRequestException } from "@nestjs/common";

export class LikeAlreadyExistException extends BadRequestException {
    constructor(error?: string) {
        super('Like to this post already exist', error)
    }
}
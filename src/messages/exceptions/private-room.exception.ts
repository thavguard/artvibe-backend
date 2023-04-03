import { BadRequestException } from "@nestjs/common";

export class PrivateRoomException extends BadRequestException {
    constructor(error?: string) {
        super('The number of people in a private room cannot exceed 2', error)
    }
}
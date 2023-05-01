import { BadRequestException } from "@nestjs/common";

export class UserNotFoundException extends BadRequestException {
  constructor(userId: number, error?: string) {
    super(`User with id ${userId} not found`, error);
  }
}

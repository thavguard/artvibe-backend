import { NotFoundException } from "@nestjs/common";

export class PostNotFoundException extends NotFoundException {
  constructor(postId: number, error?: string) {
    super(`Post with id ${postId} was not found`, error);
  }
}

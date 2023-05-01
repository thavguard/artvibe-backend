import { Controller, Get, UseGuards } from "@nestjs/common";
import { WallService } from "./wall.service";
import { CurrentUser } from "src/authentication/decorators/current-user-id.decorator";
import { PostEntity } from "src/posts/entities/post.entity";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";

@Controller("wall")
export class WallController {
  constructor(private readonly WallService: WallService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWall(@CurrentUser("id") userId: number): Promise<PostEntity[]> {
    return this.WallService.getWall(userId);
  }
}

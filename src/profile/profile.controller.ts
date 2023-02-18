import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { JwtAuthGuard } from "../authentication/guards/jwt-auth.guard";
import { UserService } from "../users/users.service";
import { CurrentUser } from "../authentication/decorators/current-user-id.decorator";

@Controller("profile")
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("current")
  async getCurrentProfile(@CurrentUser("id") userId: number): Promise<User> {
    return this.userService.findOneById(userId);
  }
}

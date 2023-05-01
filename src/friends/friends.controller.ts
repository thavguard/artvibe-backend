import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { SendFriendRequestDto } from "./dtos/send-friend-request.dto";
import { CurrentUser } from "src/authentication/decorators/current-user-id.decorator";
import { FriendEntity } from "./entities/friend.entity";
import { AcceptFriendRequestDto } from "./dtos/accept-friend-request.dto";
import { RejectFriendRequestDto } from "./dtos/reject-friend-request.dto";
import { FriendsEntity } from "./entities/friends.entity";

@Controller("friends")
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async findAll(): Promise<FriendsEntity[]> {
    return this.friendsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post("send-friend-request")
  async sendFriendRequest(
    @Body() { friendId }: SendFriendRequestDto,
    @CurrentUser("id") userId: number
  ): Promise<FriendEntity> {
    return this.friendsService.sendFriendRequest(userId, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("accept-friend-request")
  async acceptFriendRequest(
    @Body() { friendId }: AcceptFriendRequestDto,
    @CurrentUser("id") userId: number
  ): Promise<boolean> {
    return this.friendsService.acceptFriendRequest(userId, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("reject-friend-request")
  async rejectFriendRequest(
    @Body() { friendId }: RejectFriendRequestDto,
    @CurrentUser("id") userId: number
  ): Promise<boolean> {
    return this.friendsService.rejectFriendRequest(userId, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("remove-friend")
  async removeFromFriends(
    @Body() { friendId }: RejectFriendRequestDto,
    @CurrentUser("id") userId: number
  ): Promise<boolean> {
    return this.friendsService.removeFromFriends(userId, friendId);
  }
}

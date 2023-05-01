import { Module } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendEntity } from "./entities/friend.entity";
import { FriendsEntity } from "./entities/friends.entity";
import { UserModule } from "src/users/modules/users.module";
import { FriendsController } from "./friends.controller";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendEntity, FriendsEntity]),
    UserModule,
    NotificationsModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}

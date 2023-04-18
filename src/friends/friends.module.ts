import { Module } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendEntity } from "./entities/friend.entity";
import { FriendsEntity } from "./entities/friends.entity";
import { UserModule } from "src/users/modules/users.module";
import { FriendsController } from "./friends.controller";

@Module({
    imports: [TypeOrmModule.forFeature([FriendEntity, FriendsEntity]), UserModule],
    controllers: [FriendsController],
    providers: [FriendsService],
    exports: [FriendsService],
})
export class FriendsModule { }
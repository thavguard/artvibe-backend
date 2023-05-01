import { Module } from "@nestjs/common";
import { WallService } from "./wall.service";
import { WallController } from "./wall.controller";
import { PostsModule } from "src/posts/modules/posts.module";

@Module({
  imports: [PostsModule],
  controllers: [WallController],
  providers: [WallService],
})
export class WallModule {}

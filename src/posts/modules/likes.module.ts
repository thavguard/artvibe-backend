import { Module } from "@nestjs/common";
import { LikesService } from "../services/likes.service";

@Module({
  providers: [LikesService],
  controllers: [],
})
export class LikesModule {}

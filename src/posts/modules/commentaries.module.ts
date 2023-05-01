import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/modules/users.module";
import { Commentary } from "../entities/commentaries.entity";
import { PostEntity } from "../entities/post.entity";
import { CommentariesService } from "../services/commentaries.service";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, Commentary]), UserModule],
  providers: [CommentariesService],
  exports: [CommentariesService],
})
export class CommentariesModule {}

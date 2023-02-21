import { PostEntity } from './../entities/post.entity';
import { Like } from './../entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { LikesService } from "../services/likes.service";
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Like, PostEntity])],
  providers: [LikesService],
  exports: [LikesService],
  controllers: [],
})
export class LikesModule { }

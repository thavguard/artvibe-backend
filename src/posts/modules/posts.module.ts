import { Module } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { PostsController } from '../controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { UserModule } from '../../users/modules/users.module';
import { PostPhotosModule } from './post-photos.module';
import { LikesModule } from './likes.module';
import { CommentariesModule } from './commentaries.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), UserModule, PostPhotosModule, LikesModule, CommentariesModule],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService]
})
export class PostsModule {
}

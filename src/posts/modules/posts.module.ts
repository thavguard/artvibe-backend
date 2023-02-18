import { Module } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { PostsController } from '../controllers/posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../entities/post.entity';
import { CaslModule } from '../../casl/casl.module';
import { UserModule } from '../../users/users.module';
import { PostPhotosModule } from './post-photos.module';

@Module({
  imports: [CaslModule, TypeOrmModule.forFeature([PostEntity]), UserModule, PostPhotosModule],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService]
})
export class PostsModule {
}

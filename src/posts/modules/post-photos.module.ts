import { Module } from '@nestjs/common';
import { PostPhotosService } from '../services/post-photos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostPhotoEntity } from '../entities/post-photo.entity';
import { PostsModule } from './posts.module';
import { PostEntity } from '../entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostPhotoEntity, PostEntity])],
  providers: [PostPhotosService],
  exports: [PostPhotosService]
})
export class PostPhotosModule {
}

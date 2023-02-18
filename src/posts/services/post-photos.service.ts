import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostPhotoEntity } from '../entities/post-photo.entity';
import { PostsService } from './posts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostPhotosModule } from '../modules/post-photos.module';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class PostPhotosService {
  constructor(
    @InjectRepository(PostPhotoEntity)
    private readonly postPhotoRepository: Repository<PostPhotoEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>
  ) {
  }

  async addPhoto(postId: number, files: Express.Multer.File[]): Promise<PostPhotoEntity[]> {
    const post = await this.postRepository.findOneBy({ id: postId });

    for (let i = 0; i < files.length; i++) {
      const postPhoto = this.postPhotoRepository.create({ post, url: files[i].filename });
      await this.postPhotoRepository.save(postPhoto);
    }


    const postPhotos = await this.findByPostId(post.id);

    return postPhotos;
  }

  async findByPostId(id: number): Promise<PostPhotoEntity[]> {
    return this.postPhotoRepository.findBy({ id });
  }
}

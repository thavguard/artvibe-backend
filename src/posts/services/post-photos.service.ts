import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostPhotoEntity } from '../entities/post-photo.entity';
import { PostsService } from './posts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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
      const postPhoto = this.postPhotoRepository.create({ post, filename: files[i].filename });
      await this.postPhotoRepository.save(postPhoto);
    }


    const postPhotos = await this.findByPostId(post.id);

    return postPhotos;
  }

  async updatePhotos(postId: number, files?: Express.Multer.File[], photos?: PostPhotoEntity[]): Promise<boolean> {
    const post = await this.postRepository.findOneBy({ id: postId });
    
    for (let i = 0; i < post.photos.length; i++) {
      const photoMatch = photos.find(item => item.id === post.photos[i].id);
      if (!photoMatch) {
        await this.deletePhoto(post.photos[i].id);
      }
    }

    if (files?.length) {
      await this.addPhoto(post.id, files);
    }

    return true;
  }

  async deletePhoto(postId: number): Promise<DeleteResult> {
    return await this.postPhotoRepository.delete(postId);
  }

  async findByPostId(id: number): Promise<PostPhotoEntity[]> {
    return this.postPhotoRepository.findBy({ id });
  }
}

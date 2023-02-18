import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { UserService } from '../../users/users.service';
import { PostPhotosService } from './post-photos.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly usersService: UserService,
    private readonly postPhotosService: PostPhotosService
  ) {
  }

  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({
      relations: { user: true, photos: true, likes: true }
    });
  }

  async findPostById(postId: number): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: { id: postId },
      relations: { user: true, photos: true, likes: true }
    });
  }

  async findPostsByUserId(userId: number): Promise<PostEntity[]> {
    return this.postRepository.find({ where: { user: { id: userId } }, relations: { photos: true, likes: true } });
  }

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    files?: Express.Multer.File[]
  ): Promise<PostEntity> {
    const user = await this.usersService.findOneById(userId);
    const newPost = await this.postRepository.create({ user, ...createPostDto });
    const savedPost = await this.postRepository.save(newPost);
    if (files.length) {
      console.log({ files });
      await this.postPhotosService.addPhoto(savedPost.id, files);
    }


    return this.findPostById(savedPost.id);

  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto
  ): Promise<UpdateResult> {
    return this.postRepository.update(postId, updatePostDto);
  }

  async removePost(postId: number): Promise<DeleteResult> {
    return this.postRepository.delete(postId);
  }
}

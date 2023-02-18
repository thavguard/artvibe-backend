import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { PostsService } from '../services/posts.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PoliciesGuard } from '../../casl/guards/policies.guard';
import { CheckPolicies } from '../../casl/decorators/check-policies.decorator';
import { AppAbility } from '../../casl/factories/casl-ability.factory';
import { Action } from '../../authentication/enums/post-actions.enum';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CurrentUser } from '../../authentication/decorators/current-user-id.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { postsConstants } from '../constants/posts.constants';
import { diskStorage } from 'multer';
import { multerOptions } from '../../multer/configs/multer.config';
import { PostPhotosService } from '../services/post-photos.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) {

  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findPostById(id);
  }

  @Get('user/:id')
  async findPostByUserId(@Param('id') userId: number): Promise<PostEntity[]> {
    return this.postsService.findPostsByUserId(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('photos', postsConstants.maxImgCount, multerOptions))
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser('id') userId: number,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<PostEntity> {
    const post = await this.postsService.createPost(userId, createPostDto, files);
    return post;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, PostEntity)
  )
  async update(
    @Param('id') postId: number,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<UpdateResult> {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, PostEntity)
  )
  async remove(@Param('id') postId: number): Promise<DeleteResult> {
    return this.postsService.removePost(postId);
  }

  // TODO: Протестировать все роуты
}

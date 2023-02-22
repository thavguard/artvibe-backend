import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseFilePipeBuilder,
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
import { Like } from '../entities/like.entity';
import { Commentary } from '../entities/commentaries.entity';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UpdateCommentDto } from '../dtos/update-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) {

  }

  // Post

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':postId')
  async findOne(@Param('postId', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findPostById(id);
  }

  @Get('user/:userId')
  async findPostByUserId(@Param('userId') userId: number): Promise<PostEntity[]> {
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

  @Put(':postId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, PostEntity)
  )
  @UseInterceptors(FilesInterceptor('new_photos', postsConstants.maxImgCount, multerOptions))
  async update(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<UpdateResult> {
    console.log(updatePostDto);
    return this.postsService.updatePost(postId, updatePostDto, files);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, PostEntity)
  )
  async remove(@Param('postId') postId: number): Promise<DeleteResult> {
    return this.postsService.removePost(postId);
  }

  // Likes

  @Post('like/:postId')
  @UseGuards(JwtAuthGuard)
  async addLike(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser('id') userId: number
  ): Promise<Like> {
    return await this.postsService.addLike(postId, userId);
  }

  @Delete('like/:postId')
  @UseGuards(JwtAuthGuard)
  async removeLike(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser('id') userId: number
  ): Promise<DeleteResult> {
    return await this.postsService.removeLike(postId, userId);
  }

  // Comments

  @Post(':postId/comment')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser('id') userId: number,
    @Body() createCommentDto: CreateCommentDto
  ): Promise<Commentary> {
    return this.postsService.addComment(postId, userId, createCommentDto);
  }

  @Put(':postId/comment/:commentId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Commentary))
  async updateComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser('id') userId: number,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<UpdateResult> {
    return this.postsService.updateComment(postId, userId, commentId, updateCommentDto);
  }

  @Delete(':postId/comment/:commentId')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Commentary))
  async removeComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser('id') userId: number
  ): Promise<DeleteResult> {
    return this.postsService.removeComment(postId, userId, commentId);
  }

  // TODO: Протестировать все роуты
}

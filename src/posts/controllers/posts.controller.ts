import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { PostEntity } from "../entities/post.entity";
import { PostsService } from "../services/posts.service";
import { JwtAuthGuard } from "../../authentication/guards/jwt-auth.guard";
import { CreatePostDto } from "../dtos/create-post.dto";
import { Action } from "../../authentication/enums/post-actions.enum";
import { UpdatePostDto } from "../dtos/update-post.dto";
import { DeleteResult, UpdateResult } from "typeorm";
import { CurrentUser } from "../../authentication/decorators/current-user-id.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { postsConstants } from "../constants/posts.constants";
import { diskStorage } from "multer";
import { multerOptions } from "../../multer/configs/multer.config";
import { PostPhotosService } from "../services/post-photos.service";
import { Like } from "../entities/like.entity";
import { Commentary } from "../entities/commentaries.entity";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { CheckAccess } from "src/access/decorators/access.decorator";
import { PostParams } from "../enums/post-params.enum";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Post

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(":" + PostParams.postId)
  async findOne(
    @Param(PostParams.postId, ParseIntPipe) id: number
  ): Promise<PostEntity> {
    return this.postsService.findPostById(id);
  }

  @Get("user/:userId")
  async findPostByUserId(
    @Param("userId") userId: number
  ): Promise<PostEntity[]> {
    return this.postsService.findPostsByUserId(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("photos", postsConstants.maxImgCount, multerOptions)
  )
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser("id") userId: number,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<PostEntity> {
    const post = await this.postsService.createPost(
      userId,
      createPostDto,
      files
    );
    return post;
  }

  @Put(":" + PostParams.postId)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("new_photos", postsConstants.maxImgCount, multerOptions)
  )
  async update(
    @Param(PostParams.postId) postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser("id") userId: number,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<UpdateResult | ForbiddenException> {
    if (!(await this.postsService.CanManage(userId, postId))) {
      throw new ForbiddenException();
    }

    return this.postsService.updatePost(postId, updatePostDto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":" + PostParams.postId)
  async remove(
    @Param(PostParams.postId) postId: number,
    @CurrentUser("id") userId
  ): Promise<DeleteResult> {
    if (!(await this.postsService.CanManage(userId, postId))) {
      throw new ForbiddenException();
    }

    return this.postsService.removePost(postId);
  }

  // Likes

  @Post("like/:" + PostParams.postId)
  @UseGuards(JwtAuthGuard)
  async addLike(
    @Param(PostParams.postId, ParseIntPipe) postId: number,
    @CurrentUser("id") userId: number
  ): Promise<Like> {
    return await this.postsService.addLike(postId, userId);
  }

  @Delete("like/:" + PostParams.postId)
  @UseGuards(JwtAuthGuard)
  async removeLike(
    @Param(PostParams.postId, ParseIntPipe) postId: number,
    @CurrentUser("id") userId: number
  ): Promise<DeleteResult> {
    return await this.postsService.removeLike(postId, userId);
  }

  // Comments

  @Post(":" + PostParams.postId + "/comment")
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param(PostParams.postId, ParseIntPipe) postId: number,
    @CurrentUser("id") userId: number,
    @Body() createCommentDto: CreateCommentDto
  ): Promise<Commentary> {
    return this.postsService.addComment(postId, userId, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":" + PostParams.postId + "/comment/:commentId")
  async updateComment(
    @Param(PostParams.postId, ParseIntPipe) postId: number,
    @Param(PostParams.commentId, ParseIntPipe) commentId: number,
    @CurrentUser("id") userId: number,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<UpdateResult> {
    if (!(await this.postsService.CanManage(userId, postId))) {
      throw new ForbiddenException();
    }

    return this.postsService.updateComment(
      postId,
      userId,
      commentId,
      updateCommentDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":" + PostParams.postId + "/comment/:commentId")
  async removeComment(
    @Param(PostParams.postId, ParseIntPipe) postId: number,
    @Param(PostParams.commentId, ParseIntPipe) commentId: number,
    @CurrentUser("id") userId: number
  ): Promise<DeleteResult> {
    if (!(await this.postsService.CanManage(userId, postId))) {
      throw new ForbiddenException();
    }

    return this.postsService.removeComment(postId, userId, commentId);
  }
}

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PostEntity } from "../entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from "typeorm";
import { CreatePostDto } from "../dtos/create-post.dto";
import { UpdatePostDto } from "../dtos/update-post.dto";
import { PostPhotosService } from "./post-photos.service";
import { Like } from "../entities/like.entity";
import { LikesService } from "./likes.service";
import { CommentariesService } from "./commentaries.service";
import { Commentary } from "../entities/commentaries.entity";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { PostPhotoEntity } from "../entities/post-photo.entity";
import { UserService } from "src/users/services/users.service";
import { number } from "@hapi/joi";
import { selectUserDto } from "src/users/dtos/select-user.dto";
import { selectPostDto } from "../dtos/select-post.dto";
import { PostgresErrorCode } from "src/database/constraints/errors.constraint";
import { LikeAlreadyExistException } from "../exceptions/like-already-exist.exception";
import { PostNotFoundException } from "../exceptions/post-not-found.exception";
import { FriendEntity } from "src/friends/entities/friend.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly usersService: UserService,
    private readonly postPhotosService: PostPhotosService,
    private readonly likeService: LikesService,
    private readonly commentsService: CommentariesService
  ) {}

  async CanManage(userId: number, postId: number): Promise<boolean> {
    const post = await this.findPostById(postId);

    if (!post) throw new PostNotFoundException(postId);

    return post.user.id === userId;
  }

  // Post

  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({
      relations: {
        user: true,
        photos: true,
        likes: {
          user: {
            avatar: true,
          },
        },
        commentaries: true,
      },
      select: selectPostDto,
    });
  }

  async findPostById(postId: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: {
        user: true,
        photos: true,
        likes: true,
        commentaries: true,
      },
      select: selectPostDto,
    });

    if (!post) throw new PostNotFoundException(postId);

    return post;
  }

  async findPostsByUserId(userId: number): Promise<PostEntity[]> {
    const posts = await this.postRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });

    if (!posts.length)
      throw new BadRequestException("У пользователя нет постов");

    return posts;
  }

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    files?: Express.Multer.File[]
  ): Promise<PostEntity> {
    const user = await this.usersService.findOneById(userId);
    const newPost = this.postRepository.create({ user, ...createPostDto });
    const savedPost = await this.postRepository.save(newPost);

    if (files.length) {
      await this.postPhotosService.addPhoto(savedPost.id, files);
    }

    return this.findPostById(savedPost.id);
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
    files?: Express.Multer.File[]
  ): Promise<UpdateResult> {
    let photos: PostPhotoEntity[] = [];

    if (updatePostDto?.photos) {
      photos = JSON.parse(updatePostDto.photos);
    }

    await this.postPhotosService.updatePhotos(postId, files, photos);

    return this.postRepository.update(
      {
        id: postId,
      },
      { body: updatePostDto.body, title: updatePostDto.title }
    );
  }

  async removePost(postId: number): Promise<DeleteResult> {
    return this.postRepository.delete(postId);
  }

  // Likes

  async addLike(postId: number, userId: number): Promise<Like> {
    try {
      return await this.likeService.addLike(postId, userId);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new LikeAlreadyExistException();
      }

      throw new InternalServerErrorException();
    }
  }

  async removeLike(postId: number, userId: number): Promise<DeleteResult> {
    return await this.likeService.removeLike(postId, userId);
  }

  // Comments

  async addComment(
    postId: number,
    userId: number,
    createCommentDto: CreateCommentDto
  ): Promise<Commentary> {
    return await this.commentsService.addComment(
      postId,
      userId,
      createCommentDto
    );
  }

  async updateComment(
    postId: number,
    userId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto
  ): Promise<UpdateResult> {
    return await this.commentsService.updateComment(
      postId,
      userId,
      commentId,
      updateCommentDto
    );
  }

  async removeComment(
    postId: number,
    userId: number,
    commentId: number
  ): Promise<DeleteResult> {
    return await this.commentsService.removeComment(postId, userId, commentId);
  }

  // Search

  async getPostsByFriends(userId: number): Promise<PostEntity[]> {
    const user = await this.usersService.findOneById(userId);

    const friends = user.friends.friends.map((friend) => friend.id);

    let posts: PostEntity[] = [];

    for (let i = 0; i < friends.length; i++) {
      const userPosts = await this.findPostsByUserId(friends[i]);

      posts = [...posts, ...userPosts];
    }

    return posts;
  }

  async findPopularPostsForWeek(): Promise<PostEntity[]> {
    const week = 604800000;

    const dateWeekAgo = new Date().getTime() - week;

    const posts = await this.postRepository.find({
      order: {
        likes: { id: "DESC" },
      },
      where: {
        createdAt: MoreThanOrEqual(new Date(dateWeekAgo)),
      },
    });

    return posts;
  }
}

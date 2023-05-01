import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Optional,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/users/services/users.service";
import { CHECK_ACCESS } from "../decorators/access.decorator";
import { PostsService } from "src/posts/services/posts.service";
import { PostEntity } from "src/posts/entities/post.entity";
import { JwtStrategyValidateDto } from "src/authentication/dtos/jwt-strategy-validate.dto";
import { PostParams } from "src/posts/enums/post-params.enum";
import { Commentary } from "src/posts/entities/commentaries.entity";
import { CommentariesService } from "src/posts/services/commentaries.service";
import { PhotoUserEntity } from "src/users/entities/photo-user.entity";
import { PhotoUserService } from "src/users/services/photo-user.service";
import { ProfileParams } from "src/profile/enums/profile-params.enum";

interface AccessReq {
  user: JwtStrategyValidateDto;
  params?: typeof PostParams & typeof ProfileParams;
}

export type AccessSubject =
  | typeof PostEntity
  | typeof Commentary
  | typeof PhotoUserEntity;

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UserService)
    private readonly userService: UserService,
    @Optional()
    @Inject(PostsService)
    private readonly postsService: PostsService,
    @Optional()
    @Inject(CommentariesService)
    private readonly commentSerivice: CommentariesService,
    @Optional()
    @Inject(PhotoUserService)
    private readonly photoUserService: PhotoUserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const Entity =
      this.reflector.get<AccessSubject>(CHECK_ACCESS, context.getHandler()) ||
      [];

    const { user, params }: AccessReq = context.switchToHttp().getRequest();

    const userEntity = await this.userService.findOneById(user.id);

    console.log(params);

    if (userEntity.isAdmin) {
      return true;
    }

    switch (Entity) {
      case PostEntity:
        return await this.postsService.CanManage(
          userEntity.id,
          +params?.postId
        );

      case Commentary:
        return await this.commentSerivice.canManage(
          userEntity.id,
          +params?.commentId
        );

      case PhotoUserEntity:
        return await this.photoUserService.canManage(
          userEntity.id,
          +params?.photoId
        );

      default:
        return false;
    }
  }
}

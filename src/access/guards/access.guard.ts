import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/users/services/users.service";
import { CHECK_ACCESS } from "../decorators/access.decorator";
import { PostsService } from "src/posts/services/posts.service";
import { PostEntity } from "src/posts/entities/post.entity";
import { JwtStrategyValidateDto } from "src/authentication/dtos/jwt-strategy-validate.dto";
import { PostParams } from "src/posts/enums/post-params.enum";
import { Commentary } from "src/posts/entities/commentaries.entity";
import { CommentariesService } from "src/posts/services/commentaries.service";

interface AccessReq {
    user: JwtStrategyValidateDto,
    params?: typeof PostParams
}

export type AccessSubject = typeof PostEntity | typeof Commentary


@Injectable()
export class AccessGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(PostsService)
        private readonly postsService: PostsService,
        @Inject(CommentariesService)
        private readonly commentSerivice: CommentariesService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const Entity =
            this.reflector.get<AccessSubject>(
                CHECK_ACCESS,
                context.getHandler()
            ) || [];

        const { user, params }: AccessReq = context.switchToHttp().getRequest();

        const fullUser = await this.userService.findOneById(user.id)

        if (fullUser.isAdmin) {
            return true
        }

        switch (Entity) {
            case PostEntity:
                return await this.postsService.CanManage(fullUser.id, +params.postId)

            case Commentary:
                return await this.commentSerivice.canManage(fullUser.id, +params.commentId)

            default:
                return false
        }
    }


}
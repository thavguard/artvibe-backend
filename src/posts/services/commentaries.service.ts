import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/users/services/users.service";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { UpdateCommentDto } from "../dtos/update-comment.dto";
import { Commentary } from "../entities/commentaries.entity";
import { PostEntity } from "../entities/post.entity";
import { PostNotFoundException } from "../exceptions/post-not-found.exception";
import { UserNotFoundException } from "src/users/exceptions/user-not-found.exception";

@Injectable()
export class CommentariesService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,

        @InjectRepository(Commentary)
        private readonly commentRepository: Repository<Commentary>,

        private readonly userService: UserService
    ) { }

    async findOneById(commentId: number): Promise<Commentary> {
        return this.commentRepository.findOneBy({ id: commentId })
    }

    async canManage(userId: number, commentId: number): Promise<boolean> {
        const comment = await this.findOneById(commentId)

        if (!comment) throw new NotFoundException()


        return comment.user.id === userId
    }

    async addComment(postId: number, userId: number, createCommentDto: CreateCommentDto): Promise<Commentary> {
        const user = await this.userService.findOneById(userId)

        if (!user) throw new UserNotFoundException(userId)

        const post = await this.postRepository.findOneBy({ id: postId })
        const comment = this.commentRepository.create({ user, post, ...createCommentDto })
        return this.commentRepository.save(comment)
    }

    async updateComment(postId: number, userId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<UpdateResult> {
        const user = await this.userService.findOneById(userId)
        const post = await this.postRepository.findOneBy({ id: postId })

        if (!post) throw new PostNotFoundException(postId)

        return this.commentRepository.update({ user, post, id: commentId }, { ...updateCommentDto })
    }

    async removeComment(postId: number, userId: number, commentId: number): Promise<DeleteResult> {
        const user = await this.userService.findOneById(userId)
        const post = await this.postRepository.findOneBy({ id: postId })

        if (!user) throw new UserNotFoundException(userId)
        if (!post) throw new PostNotFoundException(postId)


        return this.commentRepository.delete({ user, post, id: commentId })
    }
}
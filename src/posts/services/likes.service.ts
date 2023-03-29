import { PostEntity } from './../entities/post.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Like } from './../entities/like.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from 'src/users/services/users.service';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,

        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,

        private readonly userService: UserService,
    ) { }
    async addLike(postId: number, userId: number): Promise<Like> {
        const post = await this.postRepository.findOneBy({ id: postId });
        const user = await this.userService.findOneById(userId)

        const newLike = this.likeRepository.create({ post, user });
        return await this.likeRepository.save(newLike);
    }

    async removeLike(postId: number, userId: number): Promise<DeleteResult> {
        const post = await this.postRepository.findOneBy({ id: postId });
        const user = await this.userService.findOneById(userId)

        return await this.likeRepository.delete({ post, user });
    }
}

import { Injectable } from "@nestjs/common";
import { shuffle } from "lodash";
import { PostEntity } from "src/posts/entities/post.entity";
import { PostsService } from "src/posts/services/posts.service";
import { UserService } from "src/users/services/users.service";

@Injectable()
export class WallService {
  constructor(private readonly postsService: PostsService) {}

  async getWall(userId: number): Promise<PostEntity[]> {
    const posts: PostEntity[] = [];

    const friendsPosts = await this.postsService.getPostsByFriends(userId);

    const popularPosts = await this.postsService.findPopularPostsForWeek();

    friendsPosts.forEach((friendPost) => {
      if (!posts.find((post) => post.id === friendPost.id)) {
        posts.push(friendPost);
      }
    });

    popularPosts.forEach((popPost) => {
      if (!posts.find((post) => post.id === popPost.id)) {
        posts.push(popPost);
      }
    });

    return posts;
  }
}

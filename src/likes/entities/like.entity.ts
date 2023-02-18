import { AbstractEntity } from "../../common/entities/abstract.entity";
import { Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { PostEntity } from "../../posts/entities/post.entity";
import { User } from "../../users/entities/user.entity";

@Entity("likes")
export class Like extends AbstractEntity {
  @ManyToOne(() => PostEntity, (post) => post.likes)
  @JoinColumn()
  public post: PostEntity;

  @OneToOne(() => User)
  @JoinColumn()
  public user: User;
}

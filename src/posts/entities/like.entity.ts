import { AbstractEntity } from "../../common/entities/abstract.entity";
import { Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { PostEntity } from "./post.entity";
import { User } from "../../users/entities/user.entity";

@Entity("likes")
export class Like extends AbstractEntity {
  @ManyToOne(() => PostEntity, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  public post: PostEntity;

  @OneToOne(() => User, { onDelete: 'CASCADE', })
  @JoinColumn()
  public user: User;
}


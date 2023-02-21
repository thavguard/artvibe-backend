import { AbstractEntity } from "../../common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Like } from "./like.entity";
import { User } from "../../users/entities/user.entity";
import { PostPhotoEntity } from "./post-photo.entity";
import { Commentary } from "./commentaries.entity";

@Entity("posts")
export class PostEntity extends AbstractEntity {
  @Column()
  public title: string;

  @Column()
  public body: string;

  @OneToMany(() => Like, (like) => like.post, { eager: true })
  public likes: Like[];

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn()
  public user: User;

  @OneToMany(() => PostPhotoEntity, (photo) => photo.post, { eager: true })
  public photos: PostPhotoEntity[];

  @OneToMany(() => Commentary, (comment) => comment.post, { eager: true })
  public commentaries: Commentary[]

}

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

  @OneToMany(() => Like, (like) => like.post, {
    onDelete: "CASCADE",
    eager: true,
  })
  public likes: Like[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  public user: User;

  @OneToMany(() => PostPhotoEntity, (photo) => photo.post, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  public photos: PostPhotoEntity[];

  @OneToMany(() => Commentary, (comment) => comment.post, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  public commentaries: Commentary[];
}

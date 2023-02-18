import { AbstractEntity } from "../../common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Like } from "./like.entity";
import { User } from "../../users/entities/user.entity";
import { PostPhotoEntity } from "./post-photo.entity";

@Entity("posts")
export class PostEntity extends AbstractEntity {
  @Column()
  public title: string;

  @Column()
  public body: string;

  @OneToMany(() => Like, (like) => like.post)
  public likes: Like[];

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  public user: User;

  @OneToMany(() => PostPhotoEntity, (photo) => photo.post)
  public photos: PostPhotoEntity[];
}

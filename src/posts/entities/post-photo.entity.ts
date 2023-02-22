import { AbstractEntity } from "../../common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PostEntity } from "./post.entity";

@Entity("post_photos")
export class PostPhotoEntity extends AbstractEntity {
  @Column()
  public filename: string;

  @ManyToOne(() => PostEntity, (post) => post.photos, {onDelete: 'CASCADE'})
  @JoinColumn()
  public post: PostEntity;
}

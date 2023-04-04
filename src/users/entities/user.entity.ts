import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Exclude } from 'class-transformer';
import { PostEntity } from '../../posts/entities/post.entity';
import { PhotoUserEntity } from './photo-user.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => PhotoUserEntity, (photo) => photo.user,)
  @JoinColumn()
  public avatar: PhotoUserEntity;

  @Column({ default: false })
  public isVerified: boolean;

  @Column({ default: false })
  public isAdmin: boolean;

  @OneToMany(() => PostEntity, (post) => post.user, { onDelete: 'CASCADE' })
  public posts: PostEntity[];

  @OneToMany(() => PhotoUserEntity, (entity) => entity.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  public photos: PhotoUserEntity[]
}

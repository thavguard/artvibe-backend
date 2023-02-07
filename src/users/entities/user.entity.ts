import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Exclude } from 'class-transformer';

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

  @Column({ nullable: true })
  public avatar: string;

  @Column({ default: false })
  public isVerified: boolean;
  
}

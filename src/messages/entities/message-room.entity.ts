import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Column, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MessageEntity } from './message.entity';

export class MessageRoomEntity extends AbstractEntity {
  @Column()
  public name: string;

  @ManyToMany(() => User)
  public users: User[];

  @OneToMany(() => MessageEntity, (message) => message.messageRoom, { eager: true, onDelete: 'CASCADE' })
  public messages: MessageEntity[];
}

import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MessageRoomEntity } from './message-room.entity';

@Entity('messages')
export class MessageEntity extends AbstractEntity {
  @Column({ nullable: false })
  public message: string;

  @Column({ default: false })
  public isEdited: boolean;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE', nullable: false })
  public user: User;

  @ManyToOne(() => MessageRoomEntity, (room) => room.messages, { onDelete: 'CASCADE', nullable: false })
  public messageRoom: MessageRoomEntity;

}



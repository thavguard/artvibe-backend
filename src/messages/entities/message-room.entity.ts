import { AbstractEntity } from "../../common/entities/abstract.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { MessageEntity } from "./message.entity";

@Entity("message_room")
export class MessageRoomEntity extends AbstractEntity {
  @Column()
  public name: string;

  @Column({ nullable: false })
  public isPrivate: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  public users: User[];

  @OneToMany(() => MessageEntity, (message) => message.messageRoom, {
    onDelete: "CASCADE",
    eager: true,
  })
  public messages: MessageEntity[];
}

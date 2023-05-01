import { AbstractEntity } from "src/common/entities/abstract.entity";
import { User } from "src/users/entities/user.entity";
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import { FriendEntity } from "./friend.entity";

@Entity()
export class FriendsEntity extends AbstractEntity {
  @OneToOne(() => User, (user) => user.friends)
  public user: User;

  @ManyToMany(() => FriendEntity)
  @JoinTable()
  public sentFriends: FriendEntity[];

  @ManyToMany(() => FriendEntity)
  @JoinTable()
  public receivedFriends: FriendEntity[];

  @ManyToMany(() => User)
  @JoinTable()
  public friends: User[];
}

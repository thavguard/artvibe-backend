import { AbstractEntity } from "src/common/entities/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class FriendEntity extends AbstractEntity {
  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  public user: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  public friend: User;

  @Column({ default: false })
  public isAccepted: boolean;
}

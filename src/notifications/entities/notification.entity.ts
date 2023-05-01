import { AbstractEntity } from "src/common/entities/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity("notification")
export class NotificationEntity extends AbstractEntity {
  @Column()
  public body: string;

  @Column()
  public type: string;

  @Column({ default: false })
  public isViewed: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  public user: User;
}

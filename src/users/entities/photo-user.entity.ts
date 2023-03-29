import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PhotoUserEntity extends AbstractEntity {
    @Column()
    public filename: string

    @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
    @JoinColumn()
    public user: User
}
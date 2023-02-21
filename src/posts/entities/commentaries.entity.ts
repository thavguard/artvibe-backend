import { AbstractEntity } from "src/common/entities/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { PostEntity } from "./post.entity";

@Entity('commentaries')
export class Commentary extends AbstractEntity {
    @Column()
    @JoinColumn()
    public text: string

    @ManyToOne(() => PostEntity, (post) => post.commentaries)
    public post: PostEntity

    @ManyToOne(() => User)
    public user: User
}
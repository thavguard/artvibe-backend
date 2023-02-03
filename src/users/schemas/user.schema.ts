import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ nullable: true })
    avatar: string

    @Column({ default: false })
    isVerifed: boolean
}
import {Entity, Column, JoinColumn, PrimaryGeneratedColumn, ManyToOne} from "typeorm"
import {User} from "../../users";

@Entity()
export class TokenEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user: User

    @Column()
    tokenType: string

    @Column()
    token: string
}
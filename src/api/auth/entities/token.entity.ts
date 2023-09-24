import {Entity, Column, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm"
import {User} from "../../users";

@Entity()
export class TokenEntity {
    @PrimaryColumn()
    token: string

    @Column({nullable: true})
    session: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'userId'})
    user: User

    @Column()
    tokenType: string
}
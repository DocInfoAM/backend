import {Entity, Column, OneToOne, PrimaryColumn, JoinColumn} from "typeorm"
import {User} from "../../users";

@Entity()
export class EmailProviderEntity {
    @PrimaryColumn()
    userId: number

    @OneToOne(() => User)
    @JoinColumn({name: 'userId'})
    user: User

    @Column()
    email: string

    @Column()
    passwordHash: string
}
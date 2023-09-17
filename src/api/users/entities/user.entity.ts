import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    providerType: string

    @Column({nullable: false, unique: true})
    identity: string
}
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TClinic } from "./clinic.types";

@Entity()
export class Clinic implements TClinic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;
}

import {Entity, Column, ManyToOne } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { Role } from "./Role";

@Entity()
export class User extends GenericEntity{

    @Column()
    roleId: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;
}

import {Entity, Column } from "typeorm";
import { GenericEntity } from "./GenericEntity";

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
}

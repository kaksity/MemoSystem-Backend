import {Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { File } from "./File";
import { GenericEntity } from "./GenericEntity";
import { Memo } from "./Memo";
import { MemoReceipient } from "./MemoReceipient";
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

    @OneToMany(() => MemoReceipient, (receipients) => receipients.user)
    memoReceipients: MemoReceipient[];

    @OneToMany(() => File, (files) => files.user)
    files: File[];
}

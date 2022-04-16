import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { User } from "./User";

@Entity()
export class Role extends GenericEntity{
    @Column()
    name: string;
    
    @Column()
    code: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
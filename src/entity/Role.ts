import { Column, Entity } from "typeorm";
import { GenericEntity } from "./GenericEntity";

@Entity()
export class Role extends GenericEntity{
    @Column()
    name: string;
    
    @Column()
    code: string;
}
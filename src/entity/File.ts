import { Column, Entity } from "typeorm";
import { GenericEntity } from "./GenericEntity";

@Entity()
export class File extends GenericEntity{
    
    @Column()
    userId: string;

    @Column()
    name: string;
    
    @Column()
    code: string;
    
    @Column()
    description: string;
}
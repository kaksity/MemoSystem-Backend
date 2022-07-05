import { Column, Entity } from "typeorm";
import { GenericEntity } from "./GenericEntity";

@Entity()
export class Inventory extends GenericEntity
{
    @Column()
    article: string;

    @Column()
    quantity: number;
    
    @Column()
    code: string;
}
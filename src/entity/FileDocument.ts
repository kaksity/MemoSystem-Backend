import { Column, Entity } from "typeorm";
import { GenericEntity } from "./GenericEntity";

@Entity()
export class FileDocument extends GenericEntity {
    @Column()
    fileId: string;

    @Column()
    name: string;

    @Column()
    url: string; 
}
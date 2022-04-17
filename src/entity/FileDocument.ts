import { Column, Entity, ManyToOne } from "typeorm";
import { File } from "./File";
import { GenericEntity } from "./GenericEntity";

@Entity()
export class FileDocument extends GenericEntity {
    @Column()
    fileId: string;

    @Column()
    name: string;

    @Column()
    url: string; 

    @ManyToOne(() => File, (file) => file.documents)
    file: File;
}
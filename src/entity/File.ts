import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { FileDocument } from "./FileDocument";
import { GenericEntity } from "./GenericEntity";
import { User } from "./User";

@Entity()
export class File extends GenericEntity{

    @Column()
    name: string;
    
    @Column()
    code: string;
    
    @Column()
    description: string;

    @OneToMany(() => FileDocument,(documents) => documents.file)
    documents: FileDocument[];

    @ManyToOne(() => User, (user) => user.files)
    user: User;
}
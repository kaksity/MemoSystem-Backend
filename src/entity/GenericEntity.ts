import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class GenericEntity extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
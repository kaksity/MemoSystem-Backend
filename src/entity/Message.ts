import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { MessageReceipient } from "./MessageReceipient";
import { User } from "./User";

@Entity()
export class Message extends GenericEntity
{
    @ManyToOne(() => User)
    user:User;

    @Column({type: 'longtext'})
    message: string;

    @Column()
    title: string;

    @Column()
    date: Date;

    @OneToMany(() => MessageReceipient, (receipients) => receipients.message)
    receipients: MessageReceipient[];
}
import { Column, Entity, ManyToOne } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { Message } from "./Message";
import { User } from "./User";

@Entity()
export class MessageReceipient extends GenericEntity {
    @Column()
    messageId: string;

    @ManyToOne(() => User, (user) => user.memoReceipients)
    user: User;

    @ManyToOne(() => Message,(message) => message.receipients)
    message: Message;
}
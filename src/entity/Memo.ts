import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { MemoAttachment } from "./MemoAttachment";
import { MemoReceipient } from "./MemoReceipient";
import { User } from "./User";

@Entity()
export class Memo extends GenericEntity
{
    @OneToOne(() => User)
    @JoinColumn()
    user:User;

    @Column()
    content: string;

    @Column()
    date: Date;

    @OneToMany(() => MemoReceipient, (receipients) => receipients.memo)
    receipients: MemoReceipient[];

    @OneToMany(() => MemoAttachment, (attachments) => attachments.memo)
    attachments: MemoAttachment[];
}
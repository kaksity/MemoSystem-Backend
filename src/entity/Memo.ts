import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { MemoAttachment } from "./MemoAttachment";
import { MemoComment } from "./MemoComment";
import { MemoReceipient } from "./MemoReceipient";
import { User } from "./User";

@Entity()
export class Memo extends GenericEntity
{
    @ManyToOne(() => User)
    user:User;

    @Column({type: 'longtext'})
    content: string;

    @Column()
    title: string;

    @Column()
    date: Date;

    @OneToMany(() => MemoReceipient, (receipients) => receipients.memo)
    receipients: MemoReceipient[];

    @OneToMany(() => MemoAttachment, (attachments) => attachments.memo)
    attachments: MemoAttachment[];

    @OneToMany(() => MemoComment, (comment) => comment.memo)
    comments: MemoComment[];
}
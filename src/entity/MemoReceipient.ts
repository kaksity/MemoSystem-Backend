import { Column, Entity, ManyToOne } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { Memo } from "./Memo";
import { User } from "./User";

@Entity()
export class MemoReceipient extends GenericEntity {
    @Column()
    memoId: string;

    @ManyToOne(() => User, (user) => user.memoReceipients)
    user: User;

    @ManyToOne(() => Memo, (memo) => memo.receipients)
    memo: Memo;
}
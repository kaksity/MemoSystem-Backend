import { Column, Entity, ManyToOne } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { Memo } from "./Memo";
import { User } from "./User";

@Entity()
export class MemoComment extends GenericEntity
{
    @ManyToOne(() => Memo, (memo) => memo.comments)
    memo: Memo;

    @Column({ type:'longtext' })
    message: string;

    @ManyToOne(() => User, (user) => user.memoComments)
    user: User;
}
import { Column, Entity, ManyToOne } from "typeorm";
import { GenericEntity } from "./GenericEntity";
import { Memo } from "./Memo";

@Entity()
export class MemoAttachment extends GenericEntity{
    @Column()
    memoId: string;

    @Column()
    url: string;

    @ManyToOne(() => Memo, (memo) => memo.attachments)
    memo: Memo;
}
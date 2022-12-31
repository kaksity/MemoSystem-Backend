import { belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import GenericModel from 'App/Models/GenericModel'
import Memo from 'App/Models/Memo';

export default class MemoAttachment extends GenericModel {
  
  @column()
  public memoId: string

  @column()
  public fileName: string

  @belongsTo(() => Memo)
  public memo: BelongsTo<typeof Memo>
}

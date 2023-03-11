import { belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import Memo from 'App/Models/Memo'
import User from 'App/Models/User'

export default class MemoRecipient extends GenericModel {
  @column()
  public userId: string

  @column()
  public memoId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Memo)
  public memo: BelongsTo<typeof Memo>
}

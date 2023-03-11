import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'
import Memo from 'App/Models/Memo'

export default class MemoComment extends GenericModel {
  @column()
  public userId: string

  @column()
  public memoId: string

  @column()
  public comment: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Memo)
  public memo: BelongsTo<typeof Memo>
}

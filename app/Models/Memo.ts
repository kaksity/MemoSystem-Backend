import { DateTime } from 'luxon'
import { belongsTo, column, hasMany, HasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import MemoRecipient from 'App/Models/MemoRecipient'
import User from 'App/Models/User'
import MemoAttachment from 'App/Models/MemoAttachment'
import MemoComment from 'App/Models/MemoComment'

export default class Memo extends GenericModel {
  @column()
  public userId: string

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public date: DateTime

  @hasMany(() => MemoRecipient)
  public recipients: HasMany<typeof MemoRecipient>

  @hasMany(() => MemoAttachment)
  public attachments: HasMany<typeof MemoAttachment>

  @hasMany(() => MemoComment)
  public comments: HasMany<typeof MemoComment>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}

import { DateTime } from 'luxon'
import { belongsTo, column, hasMany, HasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import GenericModel from 'App/Models/GenericModel'
import MemoRecipient from 'App/Models/MemoRecipient'
import User from 'App/Models/User'
import MemoAttachment from 'App/Models/MemoAttachment'
import MemoComment from 'App/Models/MemoComment'

export default class Memo extends GenericModel {
  
  @column()
  userId: string
  
  @column()
  title: string
  
  @column()
  content: string
  
  @column()
  date: DateTime

  @hasMany(() => MemoRecipient)
  recipients: HasMany<typeof MemoRecipient>

  @hasMany(() => MemoAttachment)
  attachments: HasMany<typeof MemoAttachment>

  @hasMany(() => MemoComment)
  comments: HasMany<typeof MemoComment>

  @belongsTo(() => User)
  user: BelongsTo<typeof User>
}

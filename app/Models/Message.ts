import { BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'
import MessageRecipient from 'App/Models/MessageRecipient'

export default class Message extends GenericModel {
  @column()
  public userId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => MessageRecipient)
  public recipients: HasMany<typeof MessageRecipient>

  @column()
  public title: string

  @column()
  public content: string
}

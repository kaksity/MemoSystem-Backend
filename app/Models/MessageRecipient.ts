import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'
import Message from 'App/Models/Message'

export default class MessageRecipient extends GenericModel {
  @column()
  public messageId: string

  @column()
  public userId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Message)
  public message: BelongsTo<typeof Message>
}

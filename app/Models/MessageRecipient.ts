import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'
import Message from 'App/Models/Message'

export default class MessageRecipient extends GenericModel {
  
  @column()
  messageId: string
  
  @column()
  userId: string

  @belongsTo(() => User)
  user: BelongsTo<typeof User>

  @belongsTo(() => Message)
  message: BelongsTo<typeof Message>
}

import { BelongsTo, HasMany, HasManyThrough, belongsTo, column, hasMany, hasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'
import MessageRecipient from 'App/Models/MessageRecipient'

export default class Message extends GenericModel {
  
  @column()
  userId: string
  
  @belongsTo(() => User)
  user: BelongsTo<typeof User>

  @hasMany(
    () => MessageRecipient
  )
  recipients: HasMany<typeof MessageRecipient>

  @column()
  title: string
  
  @column()
  content: string

}

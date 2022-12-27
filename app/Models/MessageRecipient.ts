import { column } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'

export default class MessageRecipient extends GenericModel {
  
  @column()
  messageId: string
  
  @column()
  userId: string

}

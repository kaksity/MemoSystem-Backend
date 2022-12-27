import { column } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'

export default class Message extends GenericModel {
  
  @column()
  userId: string
  
  @column()
  title: string
  
  @column()
  content: string

}

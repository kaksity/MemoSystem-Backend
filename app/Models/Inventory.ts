import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'

export default class Inventory extends GenericModel {
  @column()
  public article: string

  @column()
  public quantity: number

  @column()
  public code: string
}

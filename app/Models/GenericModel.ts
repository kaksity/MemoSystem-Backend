import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { UUIDGenerator } from 'App/InfrastructureProvider/Internal/UuidGenerator'
import { DateTime } from 'luxon'

export default class GenericModel extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static generateUUID(genericModel: GenericModel) {
    genericModel.id = UUIDGenerator.generate()
  }
}

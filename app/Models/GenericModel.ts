import { BaseModel, ModelQueryBuilderContract, beforeCreate, beforeFetch, beforeFind, column } from '@ioc:Adonis/Lucid/Orm'
import { UUIDGenerator } from 'App/InfrastructureProvider/Internal/UuidGenerator'
import { DateTime } from 'luxon'

export default class GenericModel extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column.dateTime({
    autoCreate: true,
    serialize: (dateValue: DateTime | null) => {
      return dateValue ? dateValue.setZone('utc').toLocaleString(DateTime.DATETIME_FULL) : dateValue
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (dateValue: DateTime | null) => {
      return dateValue ? dateValue.setZone('utc').toLocaleString(DateTime.DATETIME_FULL) : dateValue
    },
  })
  public updatedAt: DateTime

  @column.dateTime({
    serialize: (dateValue: DateTime | null) => {
      return dateValue ? dateValue.setZone('utc').toLocaleString(DateTime.DATETIME_FULL) : dateValue
    },
  })
  public deletedAt: DateTime

  @beforeCreate()
  public static generateUUID(genericModel: GenericModel) {
    genericModel.id = UUIDGenerator.generate()
  }

  public async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  @beforeFind()
  public static softDeletesFind = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static softDeletesFetch = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
    query.whereNull('deleted_at')
  }

}

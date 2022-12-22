import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
export default class User extends GenericModel {
  @column()
  public username: string

  @column()
  public fullName: string

  @column()
  public roleId: number

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}

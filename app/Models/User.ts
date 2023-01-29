import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import Role from 'App/Models/Role';
export default class User extends GenericModel {
  @column()
  public username: string

  @column()
  public fullName: string

  @column()
  public roleId: string

  @column({ serializeAs: null })
  public password: string

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @column()
  public rememberMeToken: string | null
}

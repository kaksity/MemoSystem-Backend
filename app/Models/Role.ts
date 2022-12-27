import { HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'

export default class Role extends GenericModel {
  @column()
  public name: string

  @column()
  public code: string

  @hasMany(() => User)
  public users: HasMany<typeof User>
}

import { belongsTo, column, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'
import FileDocument from 'App/Models/FileDocument'

export default class File extends GenericModel {
  @column()
  public userId: string

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public description: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => FileDocument)
  public documents: HasMany<typeof FileDocument>
}

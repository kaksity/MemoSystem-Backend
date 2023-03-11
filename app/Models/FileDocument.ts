import { belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import GenericModel from 'App/Models/GenericModel'
import File from 'App/Models/File'

export default class FileDocument extends GenericModel {
  @column()
  public fileId: string

  @column()
  public name: string

  @column()
  public path: string

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>
}

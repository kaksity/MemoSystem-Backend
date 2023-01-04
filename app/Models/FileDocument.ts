import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import GenericModel from 'App/Models/GenericModel'
import File from 'App/Models/File'

export default class FileDocument extends GenericModel {
  @column()
  fileId: string;

  @column()
  name: string;

  @column()
  path: string;

  @belongsTo(() => File)
  file: BelongsTo<typeof File>
}

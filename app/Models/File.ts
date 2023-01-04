import { belongsTo, column, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import GenericModel from 'App/Models/GenericModel'
import User from 'App/Models/User'
import FileDocument from 'App/Models/FileDocument';

export default class File extends GenericModel {
  @column()
  public userId: string

  @column()
  name: string;
  
  @column()
  code: string;
  
  @column()
  description: string;

  @belongsTo(() => User)
  user: BelongsTo<typeof User>

  @hasMany(() => FileDocument)
  documents: HasMany<typeof FileDocument>
}

import FileDocument from 'App/Models/FileDocument'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'

interface FileDocumentInterface {
  id: string
  name: string
  created_on: DateTime | string
  url: string
}
export default class FileDocumentResource {
  public static single(fileDocument: FileDocument): FileDocumentInterface {
    console.log(fileDocument)
    return {
      id: fileDocument.id,
      name: fileDocument.name,
      created_on: fileDocument.createdAt,
      url: `${Env.get('DISK_FILE_UPLOADS_BASE_URL')}/${fileDocument.path}`,
    }
  }
  public static collection(fileDocuments: FileDocument[]): FileDocumentInterface[] {
    return fileDocuments.map((fileDocument) => {
      return this.single(fileDocument)
    })
  }
}

import FileDocument from 'App/Models/FileDocument'
import Env from '@ioc:Adonis/Core/Env'

interface FileDocumentInterface {
    id: string,
    name: string,
    url: string
}
export default class FileDocumentResource {
    public static single(fileDocument: FileDocument): FileDocumentInterface {
        return {
            id: fileDocument.id,
            name: fileDocument.name,
            url: `${Env.get('DISK_FILE_UPLOADS_BASE_URL')}/${fileDocument.path}`
        }
    }
    public static collection(fileDocuments: FileDocument[]): FileDocumentInterface[]  {
        return fileDocuments.map(fileDocument => {
            return this.single(fileDocument)
        })
    }
}

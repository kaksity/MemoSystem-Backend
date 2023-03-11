import File from 'App/Models/File'
import FileDocument from 'App/Models/FileDocument'

export default class FileDocumentService {
  public async createFileDocument({ name, path }, file: File): Promise<void> {
    await FileDocument.create({
      name,
      path,
      fileId: file.id,
    })
  }
  public async getFileDocumentById(id: string): Promise<FileDocument | null> {
    return FileDocument.query().where('id', id).first()
  }

  public async getFileDocumentsByFileId(fileId: string): Promise<FileDocument[]> {
    return FileDocument.query().where('file_id', fileId)
  }
  public async deleteFileDocument(fileDocument: FileDocument): Promise<void> {
    await fileDocument.softDelete()
  }
}

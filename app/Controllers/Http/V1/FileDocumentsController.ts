import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import FileDocumentResource from 'App/Resources/File/FileDocumentResource'
import FileDocumentService from 'App/Services/FileDocumentService'
import FileManagerService from 'App/Services/FileManagerService'
import FileService from 'App/Services/FileService'
import UploadDocumentValidator from 'App/Validators/File/UploadDocumentValidator'

@inject()
export default class FileDocumentsController {

  constructor(private fileDocumentService: FileDocumentService, private fileService: FileService, private fileManagerService: FileManagerService) {
  }
  public async index({ response, params}: HttpContextContract) {
    const fileDocuments = await this.fileDocumentService.getFileDocumentsByFileId(params.fileId)
    return response.json(FileDocumentResource.collection(fileDocuments))
  }

  public async store({ request, response, params }: HttpContextContract) {
    await request.validate(UploadDocumentValidator)
    const { name } = request.body()

    const file = await this.fileService.getFileById(params.fileId)
    
    if (file === null) {
      throw new NotFoundException('File record does not exist')
    }
    
    const path = await this.fileManagerService.saveFile(request.file('file'), 'file-documents')

    await this.fileDocumentService.createFileDocument({ name, path }, file)
    return response.json({
      success: true,
      message: 'File Document record was created successfully'
    })
  }
  public async destroy({ response, params}: HttpContextContract) {

    const fileDocument = await this.fileDocumentService.getFileDocumentById(params.id)

    if(fileDocument === null) {
      throw new NotFoundException('File Document record does not exist')
    }

    await this.fileDocumentService.deleteFileDocument(fileDocument)

    return response.json({
      success: true,
      message: 'File Document record was deleted successfully'
    })
  }
}

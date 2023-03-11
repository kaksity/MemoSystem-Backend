import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import FileDocumentResource from 'App/Resources/File/FileDocumentResource'
import FileDocumentService from 'App/Services/FileDocumentService'
import FileManagerService from 'App/Services/FileManagerService'
import FileService from 'App/Services/FileService'
import UploadDocumentValidator from 'App/Validators/File/UploadDocumentValidator'
import { FILE_UPLOAD_DELETED_SUCCESSFULLY, FILE_UPLOAD_CREATED_SUCCESSFULLY,FILE_UPLOAD_LIST_RETRIEVED_SUCCESSFULLY } from 'App/Helpers/GeneralPurpose/CustomMessages/FileUploadCustomMessages';
import { FILE_DOES_NOT_EXIST } from 'App/Helpers/GeneralPurpose/CustomMessages/FileCustomMessages'

@inject()
export default class FileDocumentsController {
  constructor(
    private fileDocumentService: FileDocumentService,
    private fileService: FileService,
    private fileManagerService: FileManagerService
  ) {}

  public async index({ response, params }: HttpContextContract) {
    const fileDocuments = await this.fileDocumentService.getFileDocumentsByFileId(params.fileId)
    return response.json({
      success: true,
      message: FILE_UPLOAD_LIST_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: FileDocumentResource.collection(fileDocuments),
    })
  }

  public async store({ request, response, params }: HttpContextContract) {
    await request.validate(UploadDocumentValidator)
    const { name } = request.body()

    const file = await this.fileService.getFileById(params.fileId)

    if (file === null) {
      throw new NotFoundException(FILE_DOES_NOT_EXIST)
    }

    const path = await this.fileManagerService.saveFile(request.file('file'), 'file-documents')

    await this.fileDocumentService.createFileDocument({ name, path }, file)
    return response.created({
      success: true,
      status_code: 201,
      message: FILE_UPLOAD_CREATED_SUCCESSFULLY,
    })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const fileDocument = await this.fileDocumentService.getFileDocumentById(params.id)

    if (fileDocument === null) {
      throw new NotFoundException('File Document record does not exist')
    }

    await this.fileDocumentService.deleteFileDocument(fileDocument)

    return response.json({
      success: true,
      status_code: 200,
      message: FILE_UPLOAD_DELETED_SUCCESSFULLY,
    })
  }
}

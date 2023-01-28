import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AlreadyExistException from 'App/Exceptions/AlreadyExistException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import FileResource from 'App/Resources/File/FileResource'
import FileService from 'App/Services/FileService'
import FileObjectInterface from 'App/TypeChecking/ModelManagement/FileObjectInterface'
import CreateFileValidator from 'App/Validators/File/CreateFileValidator'
import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import {
  FILE_DOES_NOT_EXIST,
  FILE_ALREADY_EXIST,
  FILE_CANNOT_BE_DELETED,
  FILE_CREATED_SUCCESSFULLY,
  FILE_DETAIL_RETRIEVED_SUCCESSFULLY,
  FILE_DELETED_SUCCESSFULLY,
  FILE_UPDATED_SUCCESSFULLY,
  FILE_LIST_RETRIEVED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/FileCustomMessages'
import UpdateFileValidator from 'App/Validators/File/UpdateFileValidator'

@inject()
export default class FilesController {
  constructor(private fileService: FileService) {}

  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page')
    const limit = request.input('limit')

    const { data: files, meta } = await this.fileService.getAllFiles({ page, limit })

    return response.json({
      success: true,
      message: FILE_LIST_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: FileResource.collection(files),
      meta,
    })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    await request.validate(CreateFileValidator)

    const { name, code, description } = request.body()

    let file = await this.fileService.getFileByCode(code)

    if (file !== null) {
      throw new AlreadyExistException(FILE_ALREADY_EXIST)
    }

    const user = auth.user!

    const createFilePayloadOptions: Partial<FileObjectInterface> = {
      userId: user.id,
      name,
      code,
      description,
    }

    file = await this.fileService.createFileRecord(createFilePayloadOptions)

    const fileResponsePayload = FileResource.single(file)

    return response.created({
      success: true,
      status_code: 201,
      message: FILE_CREATED_SUCCESSFULLY,
      data: fileResponsePayload,
    })
  }

  public async show({ response, params }: HttpContextContract) {
    const file = await this.fileService.getFileById(params.id)

    if (file === NULL_OBJECT) {
      throw new NotFoundException(FILE_DOES_NOT_EXIST)
    }

    const fileResponsePayload = FileResource.single(file)

    return response.json({
      success: true,
      status_code: 200,
      message: FILE_DETAIL_RETRIEVED_SUCCESSFULLY,
      data: fileResponsePayload,
    })
  }

  public async update({ request, response, params }: HttpContextContract) {
    await request.validate(UpdateFileValidator)

    const file = await this.fileService.getFileById(params.id)

    if (file === NULL_OBJECT) {
      throw new NotFoundException(FILE_DOES_NOT_EXIST)
    }

    const { name, description } = request.body()

    const updateFileRecordPayloadOptions = {
      entityId: file.id,
      modifiedData: {
        name,
        description,
      },
      transaction: undefined,
    }

    await this.fileService.updateFileRecord(updateFileRecordPayloadOptions)

    return response.json({
      success: true,
      status_code: 200,
      message: FILE_UPDATED_SUCCESSFULLY,
      data: null,
    })
  }

  public async destroy({ response, auth, params }: HttpContextContract) {
    const file = await this.fileService.getFileById(params.id)

    if (file === null) {
      throw new NotFoundException(FILE_DOES_NOT_EXIST)
    }

    const user = auth.user!

    if (file.userId !== user.id) {
      throw new UnauthorizedException(FILE_CANNOT_BE_DELETED)
    }

    const deleteFileRecordPayloadOptions: DeleteRecordPayloadOptions = {
      entityId: file.id,
      transaction: undefined,
    }

    await this.fileService.deleteFileRecord(deleteFileRecordPayloadOptions)

    return response.json({
      success: false,
      status_code: 200,
      message: FILE_DELETED_SUCCESSFULLY,
      data: NULL_OBJECT,
    })
  }
}

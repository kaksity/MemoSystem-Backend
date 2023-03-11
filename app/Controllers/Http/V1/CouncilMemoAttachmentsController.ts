import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import MemoAttachmentResource from 'App/Resources/Memo/MemoAttachmentResource'
import MemoAttachmentService from 'App/Services/MemoAttachmentService'
import MemoService from 'App/Services/MemoService'
import CreateMemoAttachmentValidator from 'App/Validators/Memo/CreateMemoAttachmentValidator'
import FileManagerService from 'App/Services/FileManagerService'
import {
  MEMO_ATTACHMENT_CREATED_SUCCESSFULLY,
  MEMO_ATTACHMENT_DELETED_SUCCESSFULLY,
  MEMO_DOES_NOT_EXIST,
} from 'App/Helpers/GeneralPurpose/CustomMessages/MemoCustomMessages'
import { MEMO_ATTACHMENT_LIST_RETRIEVED_SUCCESSFULLY } from 'App/Helpers/GeneralPurpose/CustomMessages/MemoCustomMessages'

@inject()
export default class CouncilMemoAttachmentsController {
  constructor(
    private memoAttachment: MemoAttachmentService,
    private memoService: MemoService,
    private fileManagerService: FileManagerService
  ) {}
  public async index({ params, response }: HttpContextContract) {
    const memoAttachments = await this.memoAttachment.getMemoAttachmentByMemoId(params.memoId)
    return response.json({
      success: true,
      message: MEMO_ATTACHMENT_LIST_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: MemoAttachmentResource.collection(memoAttachments),
    })
  }

  public async store({ request, params, response }: HttpContextContract) {
    await request.validate(CreateMemoAttachmentValidator)

    const memo = await this.memoService.getMemoById(params.memoId)

    if (memo === null) {
      throw new NotFoundException(MEMO_DOES_NOT_EXIST)
    }

    const fileName = await this.fileManagerService.saveFile(
      request.file('file'),
      'memo-attachments'
    )

    await this.memoAttachment.createMemoAttachmentService({ fileName }, memo)

    return response.created({
      success: true,
      status_code: 201,
      message: MEMO_ATTACHMENT_CREATED_SUCCESSFULLY,
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const memoAttachment = await this.memoAttachment.getMemoAttachmentById(params.id)

    if (memoAttachment === null) {
      throw new NotFoundException('Memo Attachment record does not exist')
    }

    if (params.memoId !== memoAttachment.memoId) {
      throw new UnauthorizedException('Memo Attachment cannot be deleted')
    }
    await this.memoAttachment.deleteMemoAttachment(memoAttachment)

    return response.json({
      success: true,
      status_code: 200,
      message: MEMO_ATTACHMENT_DELETED_SUCCESSFULLY,
    })
  }
}

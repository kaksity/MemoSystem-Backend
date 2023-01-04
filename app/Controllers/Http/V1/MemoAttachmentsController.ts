import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import MemoAttachmentResource from 'App/Resources/Memo/MemoAttachmentResource'
import MemoAttachmentService from 'App/Services/MemoAttachmentService'
import MemoService from 'App/Services/MemoService'
import CreateMemoAttachmentValidator from 'App/Validators/Memo/CreateMemoAttachmentValidator'
import FileManagerService from '../../../Services/FileManagerService';

@inject()
export default class MemoAttachmentsController {

  constructor(private memoAttachment: MemoAttachmentService, private memoService: MemoService, private fileManagerService: FileManagerService) {
  }
  public async index({ params, response }: HttpContextContract) {
    const memoAttachments = await this.memoAttachment.getMemoAttachmentByMemoId(params.memoId)
    return response.json(MemoAttachmentResource.collection(memoAttachments))
  }

  public async store({request, params,response}: HttpContextContract) {
    await request.validate(CreateMemoAttachmentValidator)
    
    const memo = await this.memoService.getMemoById(params.memoId)

    if(memo === null) {
      throw new NotFoundException('Memo record does not exist')
    }

    const fileName = await this.fileManagerService.saveFile(request.file('file'), 'memo-attachments')
    
    await this.memoAttachment.createMemoAttachmentService({ fileName }, memo)

    return response.created({
      success: true,
      message: 'Memo Attachment record was created successfully'
    })
  }

  public async destroy({params, response}: HttpContextContract) {
    const memoAttachment = await this.memoAttachment.getMemoAttachmentById(params.id)

    if (memoAttachment === null) {
      throw new NotFoundException('Memo Attachment record does not exist')
    }

    if(params.memoId !== memoAttachment.memoId) {
      throw new UnauthorizedException('Memo Attachment cannot be deleted')
    }
    await this.memoAttachment.deleteMemoAttachment(memoAttachment)

    return response.json({
      success: true,
      message: 'Memo Attachment record was deleted successfully'
    })
  }
}

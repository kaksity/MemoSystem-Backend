import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import MemoCommentService from 'App/Services/MemoCommentService'
import CreateMemoCommentValidator from 'App/Validators/Memo/CreateMemoCommentValidator'
import MemoService from 'App/Services/MemoService'
import MemoRecipientService from 'App/Services/MemoRecipientService'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import MemoCommentResource from 'App/Resources/Memo/MemoCommentResource'

@inject()
export default class MemoCommentsController {
  /**
   *
   */
  constructor(
    public memoService: MemoService,
    public memoCommentService: MemoCommentService,
    public memoRecipientService: MemoRecipientService
  ) {}

  public async index({ response, params }: HttpContextContract) {
    const memoComments = await this.memoCommentService.getMemoCommentByMemoId(params.memoId)
    return response.json(MemoCommentResource.collection(memoComments))
  }
  public async store({ request, response, params, auth }: HttpContextContract) {
    await request.validate(CreateMemoCommentValidator)
    const memoId = params.memoId
    const memo = await this.memoService.getMemoById(memoId)

    if (memo === null) {
      throw new NotFoundException('Memo record does not exits')
    }

    const { recipients, comment } = request.body()
    const user = auth.user!

    await this.memoCommentService.createMemoComment({ comment, memoId }, user)
    await this.memoRecipientService.deleteMemoRecipientsByMemoId(memo.id)
    await this.memoRecipientService.createMemoRecipients(recipients, memo)

    return response.created({
      success: true,
      message: 'Memo Comment record was created successfully',
    })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const memoComment = await this.memoCommentService.getMemoCommentById(params.id)

    if (memoComment === null) {
      throw new NotFoundException('Memo Comment record does not exist')
    }

    // UnAuthorized delete check
    const user = auth.user!

    if (memoComment.userId !== user.id) {
      throw new UnauthorizedException('Memo Comment record cannot be deleted')
    }

    await this.memoCommentService.deleteMemoComment(memoComment)

    return response.json({
      success: true,
      message: 'Memo Comment record was deleted successfully',
    })
  }
}

import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import MemoCommentService from 'App/Services/MemoCommentService'
import CreateMemoCommentValidator from 'App/Validators/Memo/CreateMemoCommentValidator'
import MemoService from 'App/Services/MemoService'
import MemoRecipientService from 'App/Services/MemoRecipientService'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import MemoCommentResource from 'App/Resources/Memo/MemoCommentResource'
import {
  MEMO_COMMENT_CANNOT_BE_DELETED,
  MEMO_COMMENT_CREATED_SUCCESSFULLY,
  MEMO_COMMENT_DELETED_SUCCESSFULLY,
  MEMO_COMMENT_DOES_NOT_EXIST,
  MEMO_COMMENT_LIST_RETRIEVED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/MemoCustomMessages'

@inject()
export default class CouncilMemoCommentsController {
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
    return response.json({
      success: true,
      status_code: 200,
      message: MEMO_COMMENT_LIST_RETRIEVED_SUCCESSFULLY,
      data: MemoCommentResource.collection(memoComments),
    })
  }
  public async store({ request, response, params, auth }: HttpContextContract) {
    await request.validate(CreateMemoCommentValidator)
    const memoId = params.memoId
    const memo = await this.memoService.getMemoById(memoId)

    if (memo === null) {
      throw new NotFoundException(MEMO_COMMENT_DOES_NOT_EXIST)
    }

    const { recipients, comment } = request.body()
    const user = auth.user!

    await this.memoCommentService.createMemoComment({ comment, memoId }, user)
    await this.memoRecipientService.deleteMemoRecipientsByMemoId(memo.id)
    await this.memoRecipientService.createMemoRecipients(recipients, memo)

    return response.created({
      success: true,
      status_code: 201,
      message: MEMO_COMMENT_CREATED_SUCCESSFULLY,
    })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const memoComment = await this.memoCommentService.getMemoCommentById(params.id)

    if (memoComment === null) {
      throw new NotFoundException(MEMO_COMMENT_DOES_NOT_EXIST)
    }

    // UnAuthorized delete check
    const user = auth.user!

    if (memoComment.userId !== user.id) {
      throw new UnauthorizedException(MEMO_COMMENT_CANNOT_BE_DELETED)
    }

    await this.memoCommentService.deleteMemoComment(memoComment)

    return response.json({
      success: true,
      status_code: 200,
      message: MEMO_COMMENT_DELETED_SUCCESSFULLY,
    })
  }
}

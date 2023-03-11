import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MemoService from 'App/Services/MemoService'
import CreateMemoValidator from 'App/Validators/Memo/CreateMemoValidator'
import UpdateMemoValidator from 'App/Validators/Memo/UpdateMemoValidator'
import MemoRecipientService from 'App/Services/MemoRecipientService'
import MemoResource from 'App/Resources/Memo/MemoResource'
import NotFoundException from 'App/Exceptions/NotFoundException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import {
  MEMO_CANNOT_BE_UPDATED,
  MEMO_CREATED_SUCCESSFULLY,
  MEMO_DELETED_SUCCESSFULLY,
  MEMO_DOES_NOT_EXIST,
  MEMO_UPDATED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/MemoCustomMessages'
import MemoObjectInterface from 'App/TypeChecking/ModelManagement/MemoObjectInterface'

@inject()
export default class CouncilMemosController {
  constructor(public memoService: MemoService, public memoRecipientService: MemoRecipientService) {}

  public async store({ request, response, auth }: HttpContextContract) {
    await request.validate(CreateMemoValidator)

    const user = auth.user!

    const { recipients, title, date, content } = request.body()

    const createMemoOptions: Partial<MemoObjectInterface> = {
      userId: user.id,
      title,
      date,
      content,
    }

    const memo = await this.memoService.createNewMemoRecord(createMemoOptions)

    await this.memoRecipientService.createMemoRecipients(recipients, memo)

    return response.created({
      success: true,
      status_code: 201,
      message: MEMO_CREATED_SUCCESSFULLY,
    })
  }

  public async mentionedMemos({ request, response, auth }: HttpContextContract) {
    const user = auth.user!

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const { data: memos, meta } = await this.memoService.getMentionedMemoByUserId(user.id, {
      page,
      limit,
    })
    return response.json({ data: MemoResource.collection(memos), meta })
  }
  public async selfMemos({ request, auth, response }: HttpContextContract) {
    const user = auth.user!

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const { data: memos, meta } = await this.memoService.getMemosByUserId(user.id, { page, limit })

    return response.json({ data: MemoResource.collection(memos), meta })
  }
  public async show({ response, params }: HttpContextContract) {
    const memo = await this.memoService.getMemoById(params.id)

    if (memo === null) {
      throw new NotFoundException('Memo record does not exist')
    }

    return response.json({
      success: true,
      status_code: 200,
      data: MemoResource.single(memo),
    })
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    await request.validate(UpdateMemoValidator)

    const memo = await this.memoService.getMemoById(params.id)

    if (memo === null) {
      throw new NotFoundException(MEMO_DOES_NOT_EXIST)
    }

    const user = auth.user!
    if (memo.userId !== user.id) {
      throw new UnauthorizedException(MEMO_CANNOT_BE_UPDATED)
    }
    const { recipients, title, date, content } = request.body()

    const updateMemoRecordPayloadOptions = {
      entityId: memo.id,
      transaction: undefined,
      modifiedData: {
        title,
        date,
        content,
      },
    }

    await this.memoRecipientService.deleteMemoRecipientsByMemoId(memo.id)
    await this.memoRecipientService.createMemoRecipients(recipients, memo)

    await this.memoService.updateMemoRecord(updateMemoRecordPayloadOptions)

    return response.json({
      success: true,
      status_code: 200,
      message: MEMO_UPDATED_SUCCESSFULLY,
      data: null,
    })
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const user = auth.user!

    const memo = await this.memoService.getMemoById(params.id)

    if (memo === NULL_OBJECT) {
      throw new NotFoundException(MEMO_DOES_NOT_EXIST)
    }

    if (memo.userId !== user.id) {
      throw new UnauthorizedException(MEMO_DOES_NOT_EXIST)
    }

    const deleteMemoRecordPayloadOptions: DeleteRecordPayloadOptions = {
      entityId: memo.id,
      transaction: undefined,
    }

    await this.memoService.deleteMemoRecord(deleteMemoRecordPayloadOptions)

    return response.json({
      success: true,
      message: MEMO_DELETED_SUCCESSFULLY,
      status_code: 200,
      data: null,
    })
  }
}

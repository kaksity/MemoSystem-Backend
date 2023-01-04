import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MemoService from 'App/Services/MemoService'
import CreateMemoValidator from 'App/Validators/Memo/CreateMemoValidator'
import UpdateMemoValidator from 'App/Validators/Memo/UpdateMemoValidator'
import MemoRecipientService from 'App/Services/MemoRecipientService'
import MemoResource from 'App/Resources/Memo/MemoResource'
import NotFoundException from 'App/Exceptions/NotFoundException'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

@inject()
export default class MemosController {
  constructor(public memoService: MemoService, public memoRecipientService: MemoRecipientService) {}
  public async index({}: HttpContextContract) {}

  public async store({ request, response, auth }: HttpContextContract) {
    await request.validate(CreateMemoValidator)

    const { recipients, title, date, content } = request.body()

    const user = auth.user!

    const memo = await this.memoService.createNewMemo({ title, date, content }, user)
    await this.memoRecipientService.createMemoRecipients(recipients, memo)

    return response.created({
      success: true,
      message: 'Memo record was created successfully',
    })
  }
  public async mentionedMemos({ request, response, auth }: HttpContextContract) {
    const user = auth.user!

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const { data: memos, meta } = await this.memoService.getMentionedMemoByUserId(user.id, { page, limit })
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

    return response.json(MemoResource.single(memo))
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    await request.validate(UpdateMemoValidator)

    const memo = await this.memoService.getMemoById(params.id)

    if (memo === null) {
      throw new NotFoundException('Memo record does not exist')
    }

    const user = auth.user!
    if (memo.userId !== user.id) {
      throw new UnauthorizedException('Memo record cannot be updated')
    }
    const { recipients, title, date, content } = request.body()

    memo.title = title
    memo.date = date
    memo.content = content

    await this.memoRecipientService.deleteMemoRecipientsByMemoId(memo.id)
    await this.memoRecipientService.createMemoRecipients(recipients, memo)
    await this.memoService.updateMemo(memo)

    return response.created({
      success: true,
      message: 'Memo record was updated successfully',
    })
  }

  public async destroy({}: HttpContextContract) {
  }
}

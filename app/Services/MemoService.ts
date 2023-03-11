import Memo from 'App/Models/Memo'
import User from 'App/Models/User'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import UpdateRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/UpdateRecordPayloadOptions'
import MemoObjectInterface from 'App/TypeChecking/ModelManagement/MemoObjectInterface'

export default class MemoService {
  /**
   * @description
   * @author Dauda Pona
   * @param {Partial<MemoObjectInterface>} createMemoOptions
   * @returns {*}  {Promise<Memo>}
   * @memberof MemoService
   */
  public async createNewMemoRecord(createMemoOptions: Partial<MemoObjectInterface>): Promise<Memo> {
    const memo = new Memo()
    Object.assign(memo, createMemoOptions)

    if (createMemoOptions.transaction) {
      memo.useTransaction(createMemoOptions.transaction)
    }

    await memo.save()

    return memo
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {string} userId
   * @param {*} { page, limit }
   * @returns {*}  {Promise<{ data: Memo[], meta?:any }>}
   * @memberof MemoService
   */
  public async getMemosByUserId(
    userId: string,
    { page, limit }
  ): Promise<{ data: Memo[]; meta?: any }> {
    const memos = await Memo.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .orderBy('date', 'desc')
      .where('user_id', userId)
      .paginate(page, limit)
    return { data: memos.all(), meta: memos.getMeta() }
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {string} userId
   * @param {*} { page, limit }
   * @returns {*}  {Promise<{ data: Memo[], meta?: any}>}
   * @memberof MemoService
   */
  public async getMentionedMemoByUserId(
    userId: string,
    { page, limit }
  ): Promise<{ data: Memo[]; meta?: any }> {
    const memos = await Memo.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .whereHas('recipients', (recipientQuery) => {
        recipientQuery.where('user_id', userId)
      })
      .paginate(page, limit)
    return { data: memos.all(), meta: memos.getMeta() }
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<Memo | null>)}
   * @memberof MemoService
   */
  public async getMemoById(id: string): Promise<Memo | null> {
    return await Memo.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .where('id', id)
      .first()
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {UpdateRecordPayloadOptions} updatedMemoRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof MemoService
   */
  public async updateMemoRecord(
    updatedMemoRecordPayloadOptions: UpdateRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction, modifiedData } = updatedMemoRecordPayloadOptions

    const memo = await this.getMemoById(entityId)

    memo!.merge(modifiedData)

    if (transaction) {
      memo!.useTransaction(transaction)
    }

    await memo!.save()
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {DeleteRecordPayloadOptions} deleteMemoRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof MemoService
   */
  public async deleteMemoRecord(
    deleteMemoRecordPayloadOptions: DeleteRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction } = deleteMemoRecordPayloadOptions

    const memo = await this.getMemoById(entityId)
    if (transaction) {
      memo!.useTransaction(transaction)
    }

    await memo!.softDelete()
  }
}

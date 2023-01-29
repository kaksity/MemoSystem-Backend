import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import Message from 'App/Models/Message'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import MessageObjectInterface from 'App/TypeChecking/ModelManagement/MessageObjectInterface'

export default class MessageService {
  /**
   * @description
   * @author Dauda Pona
   * @param {DeleteRecordPayloadOptions} deleteMessageRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof MessageService
   */
  public async deleteMessageRecord(
    deleteMessageRecordPayloadOptions: DeleteRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction } = deleteMessageRecordPayloadOptions

    const message = await this.getMessageById(entityId)

    if (transaction) {
      message!.useTransaction(transaction)
    }

    await message!.delete()
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<Message | null>)}
   * @memberof MessageService
   */
  public async getMessageById(id: string): Promise<Message | null> {
    const message = Message.query()
      .where('id', id)
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .first()

    if (message === NULL_OBJECT) {
      return NULL_OBJECT
    }
    return message
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} userId
   * @param {*} { page, limit }
   * @returns {*}  {Promise<{ data: Message[]; meta?: any }>}
   * @memberof MessageService
   */
  public async getMessagesByUserId(
    userId: string,
    { page, limit }
  ): Promise<{ data: Message[]; meta?: any }> {
    const messages = await Message.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
    return { data: messages.all(), meta: messages.getMeta() }
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} userId
   * @param {*} { page, limit }
   * @returns {*}  {Promise<{ data: Message[]; meta?: any }>}
   * @memberof MessageService
   */
  public async getMentionedMessagesByUserId(
    userId: string,
    { page, limit }
  ): Promise<{ data: Message[]; meta?: any }> {
    const messages = await Message.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .whereHas('recipients', (query) => {
        query.where('user_id', userId)
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
    return { data: messages.all(), meta: messages.getMeta() }
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {Partial<MessageObjectInterface>} createMessageRecordOptions
   * @returns {*}  {Promise<Message>}
   * @memberof MessageService
   */
  public async createMessageRecord(
    createMessageRecordOptions: Partial<MessageObjectInterface>
  ): Promise<Message> {
    const { transaction } = createMessageRecordOptions

    const message = new Message()
    Object.assign(message, createMessageRecordOptions)

    if (transaction) {
      message.useTransaction(transaction)
    }

    await message.save()

    return message
  }
}

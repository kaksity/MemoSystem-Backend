import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import MessageRecipient from 'App/Models/MessageRecipient'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import MessageRecipientObjectInterface from 'App/TypeChecking/ModelManagement/MessageRecipientObjectInterface'

export default class MessageRecipientService {
  /**
   * @description
   * @author Dauda Pona
   * @param {Partial<MessageRecipientObjectInterface>} createMessageRecipientsPayloadOption
   * @returns {*}  {Promise<MessageRecipient>}
   * @memberof MessageRecipientService
   */
  public async createMessageRecipientRecord(
    createMessageRecipientsPayloadOption: Partial<MessageRecipientObjectInterface>
  ): Promise<MessageRecipient> {
    const { transaction } = createMessageRecipientsPayloadOption

    const messageRecipient = new MessageRecipient()

    Object.assign(messageRecipient, createMessageRecipientsPayloadOption)

    if (transaction) {
      console.log(transaction)
      messageRecipient.useTransaction(transaction)
    }

    await messageRecipient.save()

    return messageRecipient
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<MessageRecipient | null>)}
   * @memberof MessageRecipientService
   */
  public async getMessageRecipientById(id: string): Promise<MessageRecipient | null> {
    const messageRecipient = await MessageRecipient.query().where('id', id).first()

    if (messageRecipient === NULL_OBJECT) {
      return NULL_OBJECT
    }

    return messageRecipient
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {DeleteRecordPayloadOptions} deleteMessageRecipientRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof MessageRecipientService
   */
  public async deleteMessageRecipientRecord(
    deleteMessageRecipientRecordPayloadOptions: DeleteRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction } = deleteMessageRecipientRecordPayloadOptions

    const messageRecipient = await this.getMessageRecipientById(entityId)

    if (transaction) {
      messageRecipient!.useTransaction(transaction)
    }

    messageRecipient!.softDelete()
  }
}

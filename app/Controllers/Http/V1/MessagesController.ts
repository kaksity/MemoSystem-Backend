import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import MessageResource from 'App/Resources/Message/MessageResource'
import MessageService from 'App/Services/MessageService'
import CreateMessageValidator from 'App/Validators/Message/CreateMessageValidator'
import MessageRecipientService from 'App/Services/MessageRecipientService'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Database from '@ioc:Adonis/Lucid/Database'
import MessageObjectInterface from 'App/TypeChecking/ModelManagement/MessageObjectInterface'
import MessageRecipientObjectInterface from 'App/TypeChecking/ModelManagement/MessageRecipientObjectInterface'
import {
  MESSAGE_CANNOT_BE_DELETED,
  MESSAGE_CREATED_SUCCESSFULLY,
  MESSAGE_DOES_NOT_EXIST,
  MESSAGE_LIST_RETRIEVED_SUCCESSFULLY,
  MESSAGE_DETAIL_RETRIEVED_SUCCESSFULLY,
  MESSAGE_DELETED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/MessageCustomMessages'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'

@inject()
export default class MessagesController {
  constructor(
    private messageService: MessageService,
    private messageRecipientService: MessageRecipientService
  ) {}

  public async store({ request, auth, response }: HttpContextContract) {
    await request.validate(CreateMessageValidator)

    const { title, content, recipients } = request.body()
    const user = auth.user!

    let message

    await Database.transaction(async (transaction) => {
      const createMessageRecordOptions: Partial<MessageObjectInterface> = {
        title,
        content,
        transaction,
        userId: user.id,
      }

      message = await this.messageService.createMessageRecord(createMessageRecordOptions)

      for (const recipient of recipients) {
        const createMessageRecipientRecordOptions: Partial<MessageRecipientObjectInterface> = {
          messageId: message.id,
          userId: recipient,
          transaction,
        }

        await this.messageRecipientService.createMessageRecipientRecord(
          createMessageRecipientRecordOptions
        )
      }
    })

    message = await this.messageService.getMessageById(message.id)

    const messageResponsePayload = MessageResource.single(message)

    return response.created({
      success: true,
      status_code: 201,
      message: MESSAGE_CREATED_SUCCESSFULLY,
      data: messageResponsePayload,
    })
  }

  public async show({ response, params }: HttpContextContract) {
    const message = await this.messageService.getMessageById(params.id)

    if (message === null) {
      throw new NotFoundException(MESSAGE_DOES_NOT_EXIST)
    }
    return response.json({
      success: true,
      status_code: 200,
      message: MESSAGE_DETAIL_RETRIEVED_SUCCESSFULLY,
      data: MessageResource.single(message),
    })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const message = await this.messageService.getMessageById(params.id)

    if (message === null) {
      throw new NotFoundException(MESSAGE_DOES_NOT_EXIST)
    }

    const user = auth.user!
    if (message.userId !== user.id) {
      throw new UnauthorizedException(MESSAGE_CANNOT_BE_DELETED)
    }

    await Database.transaction(async (transaction) => {
      for (const recipient of message.recipients) {
        const deleteMessageRecipientRecordPayloadOptions: DeleteRecordPayloadOptions = {
          entityId: recipient.id,
          transaction,
        }

        await this.messageRecipientService.deleteMessageRecipientRecord(
          deleteMessageRecipientRecordPayloadOptions
        )
      }

      const deleteMessageRecordPayloadOptions: DeleteRecordPayloadOptions = {
        entityId: message.id,
        transaction,
      }

      await this.messageService.deleteMessageRecord(deleteMessageRecordPayloadOptions)
    })

    return response.json({
      success: true,
      message: MESSAGE_DELETED_SUCCESSFULLY,
      status_code: 200,
      data: null,
    })
  }

  public async selfMessages({ request, response, auth }: HttpContextContract) {
    const user = auth.user!

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const { data: messages, meta } = await this.messageService.getMessagesByUserId(user.id, {
      page,
      limit,
    })

    return response.json({
      success: true,
      message: MESSAGE_LIST_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: MessageResource.collection(messages),
      meta,
    })
  }

  public async mentionedMessages({ request, response, auth }: HttpContextContract) {
    const user = auth.user!

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const { data: messages, meta } = await this.messageService.getMentionedMessagesByUserId(
      user.id,
      { page, limit }
    )

    return response.json({
      success: true,
      message: MESSAGE_LIST_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: MessageResource.collection(messages),
      meta,
    })
  }
}

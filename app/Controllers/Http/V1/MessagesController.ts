import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import NotFoundException from 'App/Exceptions/NotFoundException'
import MessageResource from 'App/Resources/Message/MessageResource'
import MessageService from 'App/Services/MessageService'
import CreateMessageValidator from 'App/Validators/Message/CreateMessageValidator'
import MessageRecipientService from 'App/Services/MessageRecipientService'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'

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

    const message = await this.messageService.createMessage({ title, content }, user)

    await this.messageRecipientService.createMessageRecipients(message, recipients)

    return response.json({
      success: true,
      message: 'Message record was created successfully',
    })
  }
  public async show({ response, params }: HttpContextContract) {
    const message = await this.messageService.getMessageById(params.id)

    if (message === null) {
      throw new NotFoundException('Message record does not exist')
    }
    return response.json({ data: MessageResource.single(message) })
  }
  public async destroy({ response, params, auth }: HttpContextContract) {
    const message = await this.messageService.getMessageById(params.id)

    if (message === null) {
      throw new NotFoundException('Message record does not exist')
    }

    const user = auth.user!
    if (message.userId !== user.id) {
      throw new UnauthorizedException('Message record cannot be deleted')
    }
    await this.messageRecipientService.deleteMessageRecipientsByMessageId(message.id)
    await this.messageService.deleteMessage(message)

    return response.json({
      success: true,
      message: 'Message record was deleted successfully',
    })
  }
  public async selfMessages({ request, response, auth }: HttpContextContract) {
    const user = auth.user!
    
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    
    const { data:messages, meta} = await this.messageService.getMessagesByUserId(user.id, { page, limit })
    
    return response.json({ data: MessageResource.collection(messages), meta })
  }
  public async mentionedMessages({ request, response, auth }: HttpContextContract) {
    const user = auth.user!
    
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    
    const { data:messages, meta} = await this.messageService.getMentionedMessagesByUserId(user.id, { page, limit })
    
    return response.json({ data: MessageResource.collection(messages), meta })
  }
}

import { inject } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { NotFoundException } from 'App/Exceptions'
import { MessageResource } from 'App/Resources/Message/MessageResource'
import MessageService from 'App/Services/MessageService'
import CreateMessageValidator from 'App/Validators/Message/CreateMessageValidator'
import MessageRecipientService from 'App/Services/MessageRecipientService'

@inject()
export default class MessagesController {
    constructor(private messageService: MessageService, private messageRecipientService: MessageRecipientService) {
    }
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
    public async show({response, params}: HttpContextContract)
    {
        const message = await this.messageService.getMessageById(params.id)
        
        if(message == null) {
            throw new NotFoundException('Message record does not exist')
        }
        return response.json(MessageResource.single(message))
    }
    public async destroy({response, params}: HttpContextContract)
    {
        const message = await this.messageService.getMessageById(params.id)
        
        if(message == null) {
            throw new NotFoundException('Message record does not exist')
        }

        await this.messageRecipientService.deleteMessageRecipientsByMessageId(message.id)
        await this.messageService.deleteMessage(message)
        
        return response.json({
            success: true,
            message: 'Message record was deleted successfully',
        })
    }
    public async selfMessages({response, auth}: HttpContextContract) {
        const user = auth.user!

        const messages = await this.messageService.getMessagesByUserId(user.id)
        return response.json(MessageResource.collection(messages))
    }
    public async mentionedMessages({response, auth}: HttpContextContract) {
        const user = auth.user!

        const messages = await this.messageService.getMentionedMessagesByUserId(user.id)
        return response.json(MessageResource.collection(messages))
    }
}

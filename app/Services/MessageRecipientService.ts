import MessageRecipient from 'App/Models/MessageRecipient';
import Message from 'App/Models/Message'

export default class MessageRecipientService {
    public async createMessageRecipients(message: Message, recipients: string[]): Promise<void> {
        const messageRecipients = recipients.map(recipient => {
            return {
                messageId: message.id,
                userId: recipient
            }
        })
        console.log(messageRecipients)
        //await MessageRecipient.createMany(messageRecipients)
    }
}

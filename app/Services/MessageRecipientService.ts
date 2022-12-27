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
        await MessageRecipient.createMany(messageRecipients)
    }
    public async deleteMessageRecipientsByMessageId(messageId: string): Promise<void> {
        await MessageRecipient.query().where('message_id', messageId).delete()
    }
}

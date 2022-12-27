import Message from 'App/Models/Message'
import User from 'App/Models/User';

export default class MessageService {
    public async deleteMessage(message: Message) {
        message.delete()
    }
    public async getMessageById(id: string): Promise<Message | null>{
        return Message.query().where('id', id).first()
    }
    public async getMessages(user: User): Promise<Message[]> {
        return Message.query()
    }
    public async createMessage({title, content}: {title: string, content: string}, user: User): Promise<Message> {
        return Message.create({title, content, userId: user.id})
    }
}

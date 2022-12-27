import Message from 'App/Models/Message'
import User from 'App/Models/User';

export default class MessageService {
    public async deleteMessage(message: Message) {
        message.delete()
    }
    public async getMessageById(id: string): Promise<Message | null>{
        return Message.query().where('id', id).preload('user', (userQuery) => {
            userQuery.preload('role')
        }).preload('recipients', (recipientQuery) => {
            recipientQuery.preload('user', userQuery => {
                userQuery.preload('role')
            })
        }).first()
    }
    public async getMessagesByUserId(userId: string): Promise<Message[]> {
        return Message.query().preload('user', (userQuery) => {
            userQuery.preload('role')
        }).preload('recipients', (recipientQuery) => {
            recipientQuery.preload('user', userQuery => {
                userQuery.preload('role')
            })
        }).where('user_id', userId)
    }
    public getMentionedMessagesByUserId(userId: string): Promise<Message[]> {
        return Message.query().preload('user', (userQuery) => {
            userQuery.preload('role')
        }).preload('recipients', (recipientQuery) => {
            recipientQuery.preload('user', userQuery => {
                userQuery.preload('role')
            })
        }).whereHas('recipients', (query) => {
            query.where('user_id', userId)
        })
    }
    public async createMessage({title, content}: {title: string, content: string}, user: User): Promise<Message> {
        return Message.create({title, content, userId: user.id})
    }
}

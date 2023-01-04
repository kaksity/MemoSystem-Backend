import Message from 'App/Models/Message'
import User from 'App/Models/User';
import PaginationMetaInterface from 'App/TypeChecking/GeneralPurpose/PaginationMetaInterface';

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
    public async getMessagesByUserId(userId: string, { page, limit }): Promise<{data: Message[], meta?: any}> {
        const messages = await Message.query().preload('user', (userQuery) => {
            userQuery.preload('role')
        }).preload('recipients', (recipientQuery) => {
            recipientQuery.preload('user', userQuery => {
                userQuery.preload('role')
            })
        }).where('user_id', userId).orderBy('created_at', 'desc').paginate(page, limit)
        return { data: messages.all(), meta: messages.getMeta()}
    }
    public async getMentionedMessagesByUserId(userId: string, { page, limit }): Promise<{data: Message[], meta?: any}> {
        const messages = await Message.query().preload('user', (userQuery) => {
            userQuery.preload('role')
        }).preload('recipients', (recipientQuery) => {
            recipientQuery.preload('user', userQuery => {
                userQuery.preload('role')
            })
        }).whereHas('recipients', (query) => {
            query.where('user_id', userId)
        }).orderBy('created_at', 'desc').paginate(page, limit)
        return { data: messages.all(), meta: messages.getMeta() }
    }
    public async createMessage({title, content}: {title: string, content: string}, user: User): Promise<Message> {
        return Message.create({title, content, userId: user.id})
    }
}

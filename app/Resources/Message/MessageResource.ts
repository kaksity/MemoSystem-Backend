import Message from 'App/Models/Message'
import { DateTime } from 'luxon'
import { UserResource } from '../User/UserResource';

interface MessageInterface {
    id: string,
    title: string,
    content: string,
    date: DateTime,
    user: UserResource,
    recipients: UserResource[]
}
export default class MessageResource {
    public static single(message: Message): MessageInterface {
        const user = UserResource.single(message.user)

        const recipients = message.recipients.map(recipient => {
            return UserResource.single(recipient.user)
        })
        return {
            id: message.id,
            title: message.title,
            content: message.content,
            date: message.createdAt,
            user,
            recipients 
        }
    }
    public static collection(messages: Message[]): MessageInterface[] {
        return messages.map((message) => {
            return this.single(message)
        })
    }
}

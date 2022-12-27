import Message from 'App/Models/Message'

interface MessageInterface {
    id: string,
    message: string
}
export class MessageResource {
    public static single(message: Message): MessageInterface {
        return {
            id: message.id,
            message: message.message
        }
    }
    public static collection(messages: Message[]): MessageInterface[] {
        return messages.map((message) => {
            return this.single(message)
        })
    }
}

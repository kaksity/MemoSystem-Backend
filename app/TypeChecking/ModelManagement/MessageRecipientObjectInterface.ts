import { DateTime } from 'luxon'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database';
interface MessageRecipientObjectInterface {
  id: string

  messageId: string

  userId: string

  createdAt: DateTime

  updatedAt: DateTime

  transaction: TransactionClientContract | undefined
}

export default MessageRecipientObjectInterface

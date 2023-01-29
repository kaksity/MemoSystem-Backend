import { DateTime } from 'luxon'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

interface MessageObjectInterface {
  id: string

  userId: string

  title: string

  content: string

  createdAt: DateTime

  updatedAt: DateTime

  transaction: TransactionClientContract | undefined
}

export default MessageObjectInterface

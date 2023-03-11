import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

interface MemoObjectInterface {
  
  id: string
  
  userId: string
  
  title: string
  
  content: string
  
  date: DateTime
  
  transaction: TransactionClientContract | undefined

  createdAt: DateTime

  updatedAt: DateTime

  deletedAt: DateTime
}

export default MemoObjectInterface

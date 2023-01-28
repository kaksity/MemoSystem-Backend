import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

interface FileObjectInterface {
  id: string

  userId: string

  name: string

  code: string

  description: string

  createdAt: DateTime

  updateAt: DateTime

  transaction: TransactionClientContract | undefined
}

export default FileObjectInterface

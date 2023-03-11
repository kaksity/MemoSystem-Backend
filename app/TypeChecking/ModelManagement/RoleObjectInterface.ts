import { DateTime } from 'luxon'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

interface RoleObjectInterface {
  id: string

  name: string

  code: string

  createdAt: DateTime

  updatedAt: DateTime

  transaction: TransactionClientContract | undefined

  createdAt: DateTime

  updatedAt: DateTime

  deletedAt: DateTime
}

export default RoleObjectInterface

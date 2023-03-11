import { DateTime } from 'luxon'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
interface UserObjectInterface {
  id: string

  username: string

  fullName: string

  roleId: string

  password: string

  createdAt: DateTime

  updatedAt: DateTime

  deletedAt: DateTime

  transaction: TransactionClientContract | undefined

  createdAt: DateTime

  updatedAt: DateTime

  deletedAt: DateTime
}

export default UserObjectInterface

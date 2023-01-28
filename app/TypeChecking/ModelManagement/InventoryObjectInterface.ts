import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

interface InventoryObjectInterface {
  id: string

  article: string

  quantity: number

  code: string

  createdAt: DateTime

  updatedAt: DateTime

  transaction: TransactionClientContract | undefined
}

export default InventoryObjectInterface

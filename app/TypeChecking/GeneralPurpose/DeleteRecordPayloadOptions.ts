import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

type DeleteRecordPayloadOptions = {
  entityId: string

  transaction: TransactionClientContract | undefined
}

export default DeleteRecordPayloadOptions

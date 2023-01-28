import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

type UpdateRecordPayloadOptions = {
  entityId: string

  modifiedData: any

  transaction: TransactionClientContract | undefined
}

export default UpdateRecordPayloadOptions

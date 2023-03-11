import Memo from 'App/Models/Memo'
import MemoRecipient from 'App/Models/MemoRecipient'

export default class MemoRecipientService {
  public async createMemoRecipients(recipients: string[], memo: Memo): Promise<void> {
    const memoRecipients = recipients.map((recipient) => {
      return {
        userId: recipient,
        memoId: memo.id,
      }
    })

    await MemoRecipient.createMany(memoRecipients)
  }

  public async deleteMemoRecipientsByMemoId(memoId: string): Promise<void> {
    await MemoRecipient.query().delete().where('memo_id', memoId)
  }
}

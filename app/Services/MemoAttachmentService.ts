import Memo from 'App/Models/Memo'
import MemoAttachment from 'App/Models/MemoAttachment'
export default class MemoAttachmentService {
  public async createMemoAttachmentService({ fileName }, memo: Memo): Promise<void> {
    await MemoAttachment.create({
      memoId: memo.id,
      fileName
    })
  }
  public async getMemoAttachmentByMemoId(memoId: string): Promise<MemoAttachment[]> {
    return await MemoAttachment.query().where('memo_id', memoId).orderBy('created_at', 'desc')
  }
  public async getMemoAttachmentById(id: string): Promise<MemoAttachment | null> {
    return await MemoAttachment.query().where('id', id).first()
  }
  public async deleteMemoAttachment(memoAttachment: MemoAttachment) {
    await memoAttachment.delete()
  }
}

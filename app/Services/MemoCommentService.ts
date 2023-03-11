import MemoComment from 'App/Models/MemoComment'
import User from 'App/Models/User'

export default class MemoCommentService {
  public async createMemoComment({ memoId, comment }, user: User): Promise<void> {
    await MemoComment.create({
      memoId,
      comment,
      userId: user.id,
    })
  }
  public async getMemoCommentById(id: string): Promise<MemoComment | null> {
    return await MemoComment.query().where('id', id).first()
  }
  public async deleteMemoComment(memoComment: MemoComment): Promise<void> {
    await memoComment.softDelete()
  }
  public async getMemoCommentByMemoId(memoId: string): Promise<MemoComment[]> {
    return await MemoComment.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .orderBy('created_at', 'desc')
      .where('memo_id', memoId)
  }
}

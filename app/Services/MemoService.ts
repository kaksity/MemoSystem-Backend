import Memo from 'App/Models/Memo'
import User from 'App/Models/User'

export default class MemoService {
  public async createNewMemo({ title, date, content }, user: User): Promise<Memo> {
    return await Memo.create({ title, date, content, userId: user.id })
  }
  public async getMemosByUserId(userId: string, { page, limit }): Promise<{ data: Memo[], meta?:any }> {
    const memos = await Memo.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      }).orderBy('date', 'desc')
      .where('user_id', userId).paginate(page, limit)
      return { data: memos.all(), meta: memos.getMeta() }
  }
  
  public async getMentionedMemoByUserId(userId: string, { page, limit }): Promise<{ data: Memo[], meta?: any}> {
    const memos = await Memo.query().preload('user', userQuery => {
      userQuery.preload('role')
    }).preload('recipients', recipientQuery => {
      recipientQuery.preload('user', userQuery => {
        userQuery.preload('role')
      })
    }).whereHas('recipients', recipientQuery => {
      recipientQuery.where('user_id', userId)
    }).paginate(page, limit)
    return { data: memos.all(), meta: memos.getMeta() }
  }

  public async getMemoById(id: string): Promise<Memo | null> {
    return await Memo.query()
      .preload('user', (userQuery) => {
        userQuery.preload('role')
      })
      .preload('recipients', (recipientQuery) => {
        recipientQuery.preload('user', (userQuery) => {
          userQuery.preload('role')
        })
      })
      .where('id', id)
      .first()
  }

  public async updateMemo(memo: Memo): Promise<void> {
    await memo.save()
  }
}

import Memo from 'App/Models/Memo'
import UserResource from 'App/Resources/User/UserResource'

interface MemoInterface {
  id: string
  title: string
  content: string
  date: string
  user: UserResource
  recipients: UserResource[]
}
export default class MemoResource {
  public static single(memo: Memo): MemoInterface {
    const user = UserResource.single(memo.user)
    const recipients = memo.recipients.map((recipient) => {
      return UserResource.single(recipient.user)
    })
    return {
      id: memo.id,
      title: memo.title,
      content: memo.content,
      date: memo.date,
      user,
      recipients,
    }
  }
  public static collection(memos: Memo[]): MemoInterface[] {
    return memos.map((memo) => {
      return this.single(memo)
    })
  }
}

import MemoComment from 'App/Models/MemoComment'
import UserResource from 'App/Resources/User/UserResource'

interface MemoCommentInterface {
  id: string
  comment: string,
  date: Date,
  user: UserResource
}
export default class MemoCommentResource {
  public static single(memoComment: MemoComment): MemoCommentInterface {
    return {
      id: memoComment.id,
      comment: memoComment.comment,
      user: UserResource.single(memoComment.user),
      date: memoComment.createdAt,
    }
  }
  public static collection(memoComments: MemoComment[]): MemoCommentInterface[] {
    return memoComments.map((memoComment) => {
      return this.single(memoComment)
    })
  }
}

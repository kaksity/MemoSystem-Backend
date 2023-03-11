import MemoAttachment from 'App/Models/MemoAttachment'
import Env from '@ioc:Adonis/Core/Env'

interface MemoAttachmentInterface {
  id: string
  url: string
}
export default class MemoAttachmentResource {
  public static single(memoAttachment: MemoAttachment): MemoAttachmentInterface {
    return {
      id: memoAttachment.id,
      url: `${Env.get('DISK_FILE_UPLOADS_BASE_URL')}/${memoAttachment.fileName}`,
    }
  }
  public static collection(memoAttachments: MemoAttachment[]): MemoAttachmentInterface[] {
    return memoAttachments.map((memoAttachment) => {
      return this.single(memoAttachment)
    })
  }
}

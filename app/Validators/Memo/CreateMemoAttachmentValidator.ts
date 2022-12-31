import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateMemoAttachmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '10mb',
    })
  })

  public messages: CustomMessages = {
    'file.size': 'Memo Attachment must be 10mb or less',
    'file.required': 'Memo Attachment is required',
  }
}

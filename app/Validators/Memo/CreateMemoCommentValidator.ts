import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateMemoCommentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    recipients: schema.array([rules.minLength(1)]).members(schema.string([rules.uuid()])),
    comment: schema.string(),
  })

  public messages: CustomMessages = {
    'recipients.required': 'Memo Comment Recipients is required',
    'comment.required': 'Memo Comment is required',
    'recipients.minLength': 'Memo Comment Recipients must be at least 1',
  }
}

import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateMemoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    recipients: schema.array([rules.minLength(1)]).members(schema.string([rules.uuid()])),
    title: schema.string(),
    date: schema.date({
      format: 'yyyy-MM-dd',
    }),
    content: schema.string(),
  })

  public messages: CustomMessages = {
    'title.required': 'Memo Title is required',
    'content.required': 'Memo Content is required',
    'title.minLength': 'Memo Title must be 4 or more characters',
    'title.maxLength': 'Memo Title must not be greater than 200 characters',
    'content.minLength': 'Memo Content must be 10 or more characters',
    'recipients.minLength': 'Memo Recipients must be at least 1',
  }
}

import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateInventoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    article: schema.string([rules.minLength(3), rules.maxLength(200), rules.trim()]),
    quantity: schema.number([]),
  })

  public messages: CustomMessages = {
    'article.required': 'Article is required',
    'article.minLength': 'Article must be more that 3 characters',
    'article.maxLength': 'Article must be less than 200 characters',
    'quantity.required': 'Quantity is required',
    'quantity.number': 'Quantity must be numeric',
  }
}

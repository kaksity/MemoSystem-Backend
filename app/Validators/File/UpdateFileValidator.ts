import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateFileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([rules.minLength(3), rules.trim(), rules.maxLength(200)]),
    description: schema.string([rules.minLength(3), rules.trim(), rules.maxLength(200)]),
  })

  public messages: CustomMessages = {
    'name.required': 'File Name is required',
    'description.required': 'File Description is required',
    'name.minLength': 'File Name must be at least 3 characters',
    'description.minLength': 'File Description must be at least 3 characters',
    'name.maxLength': 'File Name must be less than 200 characters',
    'description.maxLength': 'File Description must be less than 200 characters',
  }
}
